import { calculateBirdAge } from "../services/ageService.js";
import { getStageSettings, getAllStagesForRecipe } from "../services/stageService.js";
import { calculateGeometry } from "../services/geometryService.js";
import { getFanPerformance } from "../services/fanDatabase.js";
import { calculateVentilationRequirements } from "../services/ventilationService.js";
import { generateAccurateVentilationLevels } from "../services/ventilationLevelEngine.js";
import { getCoolingSettings } from "../services/coolingService.js";
import { getHumidityControlSettings } from "../services/humidityService.js";
import { getLightingSettings } from "../services/lightingService.js";
import { getFeedingSettings } from "../services/feedingService.js";
import { calculateBirdHeat } from "../src/calculations/birdHeatCalculator.js";
import { calculateMinimumVentilation } from "../src/calculations/minimumVentilationCalculator.js";
import { calculateTransitionVentilation } from "../src/calculations/transitionVentilationCalculator.js";
import { calculateTunnelVentilation } from "../src/calculations/tunnelVentilationCalculator.js";
import { generateRecipe as generateBatchRecipe } from "../src/calculations/batchRecipeGenerator.js";
import { FAN_DATABASE } from "../src/config/fanDatabase.js";
import { STAGE_LOOKUP } from "../config/poultryConfig.js";
import { BREED_PROFILES } from "../config/breedProfiles.js";

/**
 * Controller: Orchestrates calculations from the ZSE services to return the final controller recipe.
 */
export const generateRecipe = async (req, res) => {
  try {
    const {
      farmName = "Untitled Farm",
      ownerName = "Michael Chen",
      location = "Delhi, India",
      controllerModel = "Z1000",
      length = 200,
      width = 60,
      sideWallHeight = 12,
      centerPeakHeight = 20,
      birdCapacity = 25000,
      placementDate = "",
      fanCount = 10,
      fanSize = "48 Inch",
      coolingPad = "Yes",
      coolingPadLength = 60,
      padHeight = 6,
      ambientTemp = 28,
      ambientHumidity = 65,
      breed = "Cobb 500",
      currentHouseTemp = null,
      customStages = null,
      fanInputType = "size",
      fanCFM = null
    } = req.body;

    const lengthNum = parseFloat(length) || 200;
    const widthNum = parseFloat(width) || 60;
    const sideWallHeightNum = parseFloat(sideWallHeight) || 12;
    const centerPeakHeightNum = parseFloat(centerPeakHeight) || 20;
    const heightNum = (sideWallHeightNum + centerPeakHeightNum) / 2;
    const birdCapacityNum = parseInt(birdCapacity) || 25000;
    const fanCountNum = parseInt(fanCount) || 10;
    const coolingPadLengthNum = parseFloat(coolingPadLength) || 60;
    const padHeightNum = parseFloat(padHeight) || 6;
    const ambientTempC = parseFloat(ambientTemp) || 28;
    const ambientHumPct = parseFloat(ambientHumidity) || 65;

    // 1. Calculate Age
    const birdAge = calculateBirdAge(placementDate);

    // 2. Fetch Stage parameters & setpoint limits
    let activeStage;
    let stages;

    if (customStages && Array.isArray(customStages) && customStages.length > 0) {
      // Parse custom stages from request
      const parsedCustomStages = customStages.map(s => ({
        stageNum: parseInt(s.stageNum || s.stage),
        maxAge: s.maxAge === "Infinity" || s.maxAge === Infinity || s.maxAge === null || s.maxAge === "" ? Infinity : parseFloat(s.maxAge),
        target: parseFloat(s.target || s.targetTemp),
        heat: parseFloat(s.heat || s.heatingTemp),
        cool: parseFloat(s.cool || s.coolingTemp),
        alarmMin: parseFloat(s.alarmMin || s.minAlarm),
        alarmMax: parseFloat(s.alarmMax || s.maxAlarm),
        ventSafe: 1,
        ventMin: 1,
        ventMax: 1,
        dayRange: s.dayRange || String(s.maxAge || s.dayRange)
      }));

      const foundStage = parsedCustomStages.find(s => birdAge <= s.maxAge) || parsedCustomStages[parsedCustomStages.length - 1];
      activeStage = {
        stage: foundStage.stageNum,
        dayRange: String(foundStage.dayRange),
        targetTemp: `${foundStage.target}°C`,
        heatingTemp: `${foundStage.heat}°C`,
        coolingTemp: `${foundStage.cool}°C`,
        minAlarm: `${foundStage.alarmMin}°C`,
        maxAlarm: `${foundStage.alarmMax}°C`,
        ventSafe: "1",
        ventMin: "1",
        ventMax: "1",
        rawValues: foundStage
      };

      stages = parsedCustomStages.map(s => ({
        stage: s.stageNum,
        dayRange: String(s.dayRange),
        targetTemp: `${s.target}°C`,
        heatingTemp: `${s.heat}°C`,
        coolingTemp: `${s.cool}°C`,
        minAlarm: `${s.alarmMin}°C`,
        maxAlarm: `${s.alarmMax}°C`,
        ventSafe: "1",
        ventMin: "1",
        ventMax: "1"
      }));
    } else {
      activeStage = getStageSettings(birdAge, null, breed);
      stages = getAllStagesForRecipe(null, breed);
    }
    const targetTempNum = parseFloat(activeStage.rawValues.target) || 30.0;
    
    // Setpoints offsets for simulation testing
    const houseTempNumTrans = parseFloat(currentHouseTemp) || (targetTempNum + 1.2); 
    const houseTempNumTunnel = parseFloat(currentHouseTemp) || (targetTempNum + 3.2); // Trigger tunnel ventilation

    // 3. Compute House Geometry
    const geom = calculateGeometry(lengthNum, widthNum, heightNum, birdCapacityNum);

    // 4. Retrieve Fan Performance Ratings
    let fanInfo;
    let resolvedFanSize = fanSize;
    if (fanInputType === "cfm" && fanCFM) {
      const parsedCFM = parseFloat(fanCFM) || 20000;
      const dbKeys = ["24 Inch", "36 Inch", "48 Inch", "50 Inch", "54 Inch", "60 Inch"];
      let closestKey = "48 Inch";
      let minDiff = Infinity;
      const fanDb = {
        "24 Inch": { size: 24, cfm: 6000, hp: 0.5, efficiencyCfmPerWatt: 12.5 },
        "36 Inch": { size: 36, cfm: 11000, hp: 0.75, efficiencyCfmPerWatt: 15.0 },
        "48 Inch": { size: 48, cfm: 20000, hp: 1.5, efficiencyCfmPerWatt: 18.5 },
        "50 Inch": { size: 50, cfm: 22000, hp: 1.5, efficiencyCfmPerWatt: 19.0 },
        "54 Inch": { size: 54, cfm: 25000, hp: 2.0, efficiencyCfmPerWatt: 20.0 },
        "60 Inch": { size: 60, cfm: 30000, hp: 2.5, efficiencyCfmPerWatt: 21.0 }
      };
      for (const key of dbKeys) {
        const diff = Math.abs(fanDb[key].cfm - parsedCFM);
        if (diff < minDiff) {
          minDiff = diff;
          closestKey = key;
        }
      }
      const matched = fanDb[closestKey];
      fanInfo = {
        model: `${parsedCFM} CFM (Custom)`,
        sizeInches: matched.size,
        ratedCfm: parsedCFM,
        hp: matched.hp,
        efficiencyCfmPerWatt: matched.efficiencyCfmPerWatt
      };
      resolvedFanSize = `${matched.size} Inch`;
    } else {
      fanInfo = getFanPerformance(fanSize);
    }
    const totalInstalledCFM = fanCountNum * fanInfo.ratedCfm;

    // 5. Compute Heat Production details (Module 01)
    const heat = calculateBirdHeat(birdAge, birdCapacityNum, breed);

    // Shared structures for decoupled calculator arguments
    const farmConfig = {
      farmName: farmName,
      length: lengthNum,
      width: widthNum,
      height: heightNum,
      fanCount: fanCountNum,
      fanSize: resolvedFanSize,
      coolingPad: coolingPad,
      padLength: coolingPadLengthNum,
      padHeight: padHeightNum,
      birdCapacity: birdCapacityNum
    };
    const birdData = {
      age: birdAge,
      birdCount: birdCapacityNum,
      weight: heat.birdWeight,
      heat: heat.heatPerBird,
      moisture: 0.15
    };
    const weather = {
      ambientTemp: ambientTempC,
      ambientHumidity: ambientHumPct
    };

    // 6. Compute Minimum Ventilation details (Module 02)
    const minVent = calculateMinimumVentilation(farmConfig, birdData, weather, FAN_DATABASE);

    // 7. Compute Transition Ventilation details (Module 03)
    const houseConditionsTrans = {
      targetTemp: targetTempNum,
      currentHouseTemp: houseTempNumTrans,
      currentStage: activeStage.stage
    };
    const transVent = calculateTransitionVentilation(
      farmConfig,
      weather,
      birdData,
      houseConditionsTrans,
      FAN_DATABASE
    );

    // 8. Compute Tunnel Ventilation details (Module 04)
    const tunnelVent = calculateTunnelVentilation(
      birdAge,
      widthNum,
      heightNum,
      fanCountNum,
      fanInfo.ratedCfm,
      fanInfo.hp,
      coolingPad,
      ambientHumPct,
      targetTempNum,
      houseTempNumTunnel
    );

    // 9. Run Ventilation Engineering Calculations
    const vent = calculateVentilationRequirements(
      birdAge, 
      birdCapacityNum, 
      ambientTempC, 
      ambientHumPct, 
      widthNum, 
      heightNum, 
      geom.volume
    );

    // 10. Generate 16 Levels of Ventilation (Physics-based fan selection engine)
    // Build stage data with air speed limits for the engine
    const stagesWithAirSpeeds = (customStages && Array.isArray(customStages) && customStages.length > 0)
      ? customStages.map((s, idx) => {
          const stageConfig = STAGE_LOOKUP[idx] || STAGE_LOOKUP[STAGE_LOOKUP.length - 1];
          return {
            stageNum: parseInt(s.stageNum || s.stage || (idx + 1)),
            maxAge: s.maxAge === "Infinity" || s.maxAge === Infinity || s.maxAge === null || s.maxAge === "" ? Infinity : parseFloat(s.maxAge || stageConfig.maxAge),
            minAirSpeed: parseFloat(s.minAirSpeed) || stageConfig.minAirSpeed || 25,
            maxAirSpeed: parseFloat(s.maxAirSpeed) || stageConfig.maxAirSpeed || 600,
            heatingTemp: parseFloat(s.heat || s.heatingTemp) || stageConfig.heat || 0,
            targetTemp: parseFloat(s.target || s.targetTemp) || stageConfig.target || 0
          };
        })
      : STAGE_LOOKUP.map(s => ({
          stageNum: s.stageNum,
          maxAge: s.maxAge,
          minAirSpeed: s.minAirSpeed,
          maxAirSpeed: s.maxAirSpeed,
          heatingTemp: s.heat,
          targetTemp: s.target
        }));

    const ventResult = generateAccurateVentilationLevels({
      width: widthNum,
      height: heightNum,
      fanCount: fanCountNum,
      singleFanCFM: fanInfo.ratedCfm,
      birdCapacity: birdCapacityNum,
      stages: stagesWithAirSpeeds
    });

    const levels = ventResult.levels;
    const stageVentilation = ventResult.stageMapping;
    const ventilationWarnings = ventResult.warnings;

    // 11. Get Cooling Settings
    const cooling = getCoolingSettings(birdAge, coolingPad);

    // 12. Get Humidity Treatment Program
    const humDetails = getHumidityControlSettings(birdAge, ambientHumPct);

    // 13. Get Lighting & Feeding Schedules
    const lighting = controllerModel === "Z800" ? [] : getLightingSettings(birdAge);
    const feeding = controllerModel === "Z800" ? [] : getFeedingSettings(birdAge);

    // Dynamic batch-based engineering calculations
    const breedData = BREED_PROFILES[breed] || BREED_PROFILES["Cobb 500"];
    const minBirdWeight = breedData[0].weightKg;
    const maxBirdWeight = breedData[breedData.length - 1].weightKg;

    let batchEndDay = 42;
    if (customStages && Array.isArray(customStages) && customStages.length > 0) {
      const lastStage = customStages[customStages.length - 1];
      const maxAgeVal = lastStage.maxAge || lastStage.age;
      batchEndDay = maxAgeVal === "Infinity" || maxAgeVal === Infinity || maxAgeVal === null || maxAgeVal === "" ? 42 : parseFloat(maxAgeVal);
    } else {
      const lastStage = STAGE_LOOKUP[STAGE_LOOKUP.length - 1];
      batchEndDay = lastStage.maxAge === Infinity ? 42 : lastStage.maxAge;
    }

    const crossSectionArea = ventResult.crossSectionArea || (widthNum * heightNum);

    // Day 0 Placement calculations (minimum ventilation)
    const minTotalFlockWeightKg = birdCapacityNum * minBirdWeight;
    const minCFM = Math.round(minTotalFlockWeightKg * 0.4); // cfmMinLimit
    const minAirSpeed = crossSectionArea > 0 ? Math.round(minCFM / crossSectionArea) : 0;
    const maxAirExchange = minCFM > 0 ? Math.round((geom.volume * 60) / minCFM) : 300;

    // End Day calculations (maximum/tunnel ventilation)
    const maxTotalFlockWeightKg = birdCapacityNum * maxBirdWeight;
    const maxCFM = Math.round(maxTotalFlockWeightKg * 4.0); // cfmMaxLimit
    const maxAirSpeed = crossSectionArea > 0 ? Math.round(maxCFM / crossSectionArea) : 0;
    const minAirExchange = maxCFM > 0 ? Math.round((geom.volume * 60) / maxCFM) : 60;

    // Recommendations Engine
    const ventilationStatus = totalInstalledCFM >= maxCFM
      ? "✔ Fan capacity is sufficient."
      : "⚠ Additional ventilation is recommended.";
    const reserveCapacity = totalInstalledCFM - maxCFM;
    const reservePct = Math.round((reserveCapacity / maxCFM) * 100);
    const ventilationMargin = {
      available: `${totalInstalledCFM.toLocaleString()} CFM`,
      required: `${maxCFM.toLocaleString()} CFM`,
      reserve: `${reserveCapacity >= 0 ? '+' : ''}${reserveCapacity.toLocaleString()} CFM`,
      percentage: `${reserveCapacity >= 0 ? '+' : ''}${reservePct}%`
    };
    const ventilationEfficiency = reserveCapacity >= 0.15 * maxCFM
      ? "Excellent"
      : reserveCapacity >= 0
        ? "Good"
        : "Needs Improvement";
    const systemStatus = totalInstalledCFM >= maxCFM
      ? "✔ Ready for AI Recipe Generation"
      : "⚠ Fan configuration should be reviewed";

    const formatTime = () => {
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date().toLocaleDateString('en-US', options);
    };

    // Generate Batch Recipe (Handles Z1000 and Z800 logic)
    const batchRecipe = generateBatchRecipe(farmConfig, breed, FAN_DATABASE, controllerModel);

    const recipe = {
      recipeName: `${farmName.replace(/farm/i, "").trim()} ZSE Recipe`,
      farmName: farmName,
      ownerName: ownerName,
      controllerModel: controllerModel,
      generatedTime: formatTime(),
      weatherUsed: `${location} (${ambientTempC}°C, ${ambientHumPct}% RH) - ZSE API Forecast`,
      farmType: "Broiler Poultry",
      location: location,
      controllerVersion: "v2.5.0",
      status: "Generated Successfully",
      calculatedParameters: {
        birdAgeDays: birdAge,
        estimatedBirdWeight: `${heat.birdWeight} kg`,
        totalFlockWeight: `${Math.round(vent.totalFlockWeightKg).toLocaleString()} kg`,
        areaSqFt: `${geom.floorArea.toLocaleString()} sq ft`,
        volumeCuFt: `${geom.volume.toLocaleString()} cu ft`,
        birdDensity: `${geom.birdDensity} birds/sq ft`,
        requiredAirSpeed: `${vent.requiredAirSpeed} ft/min`,
        airExchangeSeconds: `${vent.airExchangeSeconds} seconds`,
        requiredCFM: `${vent.requiredCFM.toLocaleString()} CFM`,
        singleFanCFM: `${fanInfo.ratedCfm.toLocaleString()} CFM`,
        totalFanCFM: `${totalInstalledCFM.toLocaleString()} CFM`,
        coolingPadArea: `${coolingPadLengthNum * padHeightNum} sq ft`,
        estimatedHeatProduction: `${heat.heatPerBird} W/bird`,
        estimatedTotalHeatLoad: `${heat.totalHeatKw} kW`,
        batchDuration: `${batchEndDay} Days`,
        estWeightRange: `${minBirdWeight.toFixed(3)} kg → ${maxBirdWeight.toFixed(2)} kg`,
        totalFlockWeightRange: `${Math.round(minTotalFlockWeightKg).toLocaleString()} kg → ${Math.round(maxTotalFlockWeightKg).toLocaleString()} kg`,
        requiredCFMRange: `${minCFM.toLocaleString()} CFM → ${maxCFM.toLocaleString()} CFM`,
        requiredAirSpeedRange: `${minAirSpeed} ft/min → ${maxAirSpeed} ft/min`,
        airExchangeRange: `${minAirExchange}s to ${maxAirExchange}s`,
        totalRequiredCFM: `${maxCFM.toLocaleString()} CFM`,
        minimumRequiredCFM: `${minCFM.toLocaleString()} CFM`,
        maximumRequiredCFM: `${maxCFM.toLocaleString()} CFM`,
        totalRequiredCFMMin: `${minCFM.toLocaleString()} CFM`,
        totalRequiredCFMMax: `${maxCFM.toLocaleString()} CFM`,
        requiredAirSpeedMin: `${minAirSpeed} ft/min`,
        requiredAirSpeedMax: `${maxAirSpeed} ft/min`,
        recommendations: {
          ventilationStatus,
          ventilationMargin,
          ventilationEfficiency,
          systemStatus
        },
        minimumVentilationDetails: {
          requiredCFM: `${minVent.requiredCFM.toLocaleString()} CFM`,
          continuousFans: minVent.continuousFans,
          timerFans: minVent.timerFans,
          fanOnTime: `${minVent.fanOnTime}s`,
          fanOffTime: `${minVent.fanOffTime}s`,
          rotationalFans: minVent.rotationalFans
        },
        transitionVentilationDetails: {
          targetTemperature: `${targetTempNum}°C`,
          currentHouseTemperature: `${houseTempNumTrans}°C`,
          temperatureDifference: transVent.temperatureDifference,
          requiredCFM: `${transVent.requiredCFM.toLocaleString()} CFM`,
          requiredAirSpeed: transVent.requiredAirSpeed,
          selectedVentilationLevel: transVent.selectedVentilationLevel,
          continuousFans: transVent.continuousFans,
          timerFans: transVent.timerFans,
          rotationalFans: transVent.rotationalFans,
          fanOnTime: `${transVent.fanOnTime}s`,
          fanOffTime: `${transVent.fanOffTime}s`,
          vfdSpeed: transVent.vfdSpeed
        },
        tunnelVentilationDetails: {
          targetTemperature: `${targetTempNum}°C`,
          simulatedHouseTemperature: `${houseTempNumTunnel}°C`,
          requiredAirVelocity: tunnelVent.requiredAirVelocity,
          requiredCFM: `${tunnelVent.requiredCFM.toLocaleString()} CFM`,
          installedCFM: `${tunnelVent.installedCFM.toLocaleString()} CFM`,
          requiredFans: tunnelVent.requiredFans,
          continuousFans: tunnelVent.continuousFans,
          timerFans: tunnelVent.timerFans,
          rotationalFans: tunnelVent.rotationalFans,
          fanOnTime: `${tunnelVent.fanOnTime}s`,
          fanOffTime: `${tunnelVent.fanOffTime}s`,
          vfdSpeed: tunnelVent.vfdSpeed,
          selectedTunnelLevel: tunnelVent.selectedTunnelLevel,
          coolingPadActivated: tunnelVent.coolingEnabled,
          estimatedPowerConsumption: tunnelVent.estimatedPowerConsumption
        }
      },
      recipeData: {
        stages: batchRecipe.stageSettingsTable.map(s => ({
          stageNum: s.stage,
          stage: s.stage,
          day: s.day,
          dayRange: String(s.day),
          targetTemp: `${s.targetTemp}°C`,
          heatingTemp: `${s.heatingTemp}°C`,
          coolingTemp: `${s.coolingTemp}°C`,
          minAlarm: `${s.minTempAlarm}°C`,
          maxAlarm: `${s.maxTempAlarm}°C`,
          ventSafe: String(s.ventLevelSafe),
          ventMin: String(s.ventLevelMin),
          ventMax: String(s.ventLevelMax),
          target: s.targetTemp,
          heat: s.heatingTemp,
          cool: s.coolingTemp
        })),
        ventilation: batchRecipe.ventilationLevelTable.map(v => ({
          level: v.level,
          cfm: v.targetCFM,
          tDelta: v.tDiff,
          fanOn: v.fanOnTimeSec,
          fanOff: v.fanOffTimeSec,
          fanPct: `${v.vfdValue}%`,
          fans: v.fanStates,
          errorPercent: 0,
          airSpeedFtMin: 0,
          airSpeedMs: 0,
          fanDetails: { continuous: v.continuousFans, timer: v.timerFans, rotational: v.rotationalFans }
        })),
        stageVentilation: batchRecipe.stageSettingsTable, // just to pass something
        ventilationWarnings: [],
        cooling: batchRecipe.coolingSettingsTable.map(c => ({
          day: c.day,
          startTime: c.start,
          stopTime: c.stop,
          onTime: c.onTimeSec,
          minOff: c.minOffSec,
          maxOff: c.maxOffSec,
          offRH: c.humidityOff,
          tDiff: c.tDiff,
          foggerOn: c.foggerOn || 0,
          foggerMinOff: c.foggerMinOff || 0,
          foggerMaxOff: c.foggerMaxOff || 0,
          foggerOffRH: c.foggerOffRH || 0,
          foggerTDiff: c.foggerTDiff || 0
        })),
        humidity: batchRecipe.humidityTreatmentTable.map(h => ({
          day: h.day,
          humidity: h.humidity,
          delay: h.delay,
          duration: h.duration
        })),
        lighting,
        feeding,
        humidityTreatment: null
      }
    };

    return res.status(200).json({
      success: true,
      message: "Climate recipe generated successfully via ZSE Services!",
      recipe
    });
  } catch (error) {
    console.error("Error generating recipe:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error occurred during ZSE processing.",
      error: error.message
    });
  }
};

export const getStages = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      stages: STAGE_LOOKUP
    });
  } catch (error) {
    console.error("Error fetching default stages:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch default stage settings.",
      error: error.message
    });
  }
};
