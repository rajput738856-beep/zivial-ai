import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, Home, ChevronRight, Info } from 'lucide-react';
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import PageStepper from "../../components/common/PageStepper";

const FarmInfrastructure = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialData = location.state || {};

  const [formData, setFormData] = useState({
    farmName: initialData.farmName || '',
    ownerName: initialData.ownerName || '',
    location: initialData.location || '',
    controllerModel: initialData.controllerModel || '',
    length: initialData.length || '',
    width: initialData.width || '',
    height: initialData.height || '',
    birdCapacity: initialData.birdCapacity || '',
    placementDate: initialData.placementDate || '',
    fanCount: initialData.fanCount || '',
    fanInputType: initialData.fanInputType || 'size',
    fanSize: initialData.fanSize || '48 Inch',
    fanCFM: initialData.fanCFM || '',
    coolingPadLength: initialData.coolingPadLength || '',
    padHeight: initialData.padHeight || ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFanInputTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      fanInputType: type
    }));
    setErrors(prev => ({
      ...prev,
      fanSize: '',
      fanCFM: ''
    }));
  };


  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.farmName.trim()) newErrors.farmName = 'Farm name is required';
    if (!formData.ownerName.trim()) newErrors.ownerName = 'Owner name is required';
    if (!formData.location.trim()) {
      newErrors.location = 'Pincode is required';
    } else if (!/^\d{6}$/.test(formData.location.trim())) {
      newErrors.location = 'Enter a valid 6-digit pincode';
    }
    if (!formData.controllerModel) newErrors.controllerModel = 'Controller model is required';
    if (!formData.length) newErrors.length = 'Length is required';
    if (!formData.width) newErrors.width = 'Width is required';
    if (!formData.height) newErrors.height = 'Height is required';
    if (!formData.birdCapacity) newErrors.birdCapacity = 'Bird count is required';
    if (!formData.placementDate) newErrors.placementDate = 'Placement date is required';
    if (!formData.fanCount) newErrors.fanCount = 'Fan count is required';

    if (formData.fanInputType === 'size') {
      if (!formData.fanSize) newErrors.fanSize = 'Fan size is required';
    } else {
      if (!formData.fanCFM) {
        newErrors.fanCFM = 'Fan CFM is required';
      } else if (isNaN(formData.fanCFM) || parseFloat(formData.fanCFM) <= 0) {
        newErrors.fanCFM = 'Fan CFM must be a positive number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (validateForm()) {
      navigate('/farm-preview', { 
        state: { 
          ...formData,
          length: parseFloat(formData.length) || 200,
          width: parseFloat(formData.width) || 60,
          height: parseFloat(formData.height) || 20,
          birdCapacity: parseInt(formData.birdCapacity) || 25000,
          placementDate: formData.placementDate,
          fanCount: parseInt(formData.fanCount) || 8,
          fanSize: formData.fanInputType === 'size' ? formData.fanSize : '',
          fanCFM: formData.fanInputType === 'cfm' ? formData.fanCFM : '',
          coolingPadLength: parseFloat(formData.coolingPadLength) || 60,
          padHeight: parseFloat(formData.padHeight) || 6,
        } 
      });
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white overflow-hidden">
      <Navbar />

      <div className="pt-24 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Stepper */}
          <PageStepper currentStep={1} />

          {/* Breadcrumb */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-zinc-400 mb-8"
          >
            <a href="/" className="hover:text-white transition-colors flex items-center gap-1.5">
              <Home size={16} />
              Home
            </a>
            <ChevronRight size={15} className="opacity-60" />
            <span>ZSE Engine</span>
            <ChevronRight size={15} className="opacity-60" />
            <span className="text-white font-medium">Create New Farm</span>
          </motion.div>

          {/* Header */}
          <div className="mb-12">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl font-semibold tracking-tighter mb-4"
            >
              Create New Farm
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-zinc-400 max-w-2xl"
            >
              Fill in your farm configuration to generate precise controller recipes using the ZSE calculation engine.
            </motion.p>
          </div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 lg:p-12 shadow-2xl"
          >
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-10 lg:gap-y-16">
              {/* Left Column - Farm Information */}
              <div className="space-y-10">
                <div>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="h-px w-10 bg-brand"></div>
                    <h2 className="text-3xl font-semibold tracking-tight">Farm Information</h2>
                  </div>

                  <div className="space-y-8">
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-2.5">Farm Name <span className="text-brand">*</span></label>
                      <input
                        type="text"
                        name="farmName"
                        value={formData.farmName}
                        onChange={handleChange}
                        placeholder="Evergreen Poultry Farm"
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-2xl px-7 py-4 text-lg focus:outline-none focus:border-brand transition-colors placeholder-zinc-500"
                      />
                      {errors.farmName && <p className="text-brand text-sm mt-2">{errors.farmName}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-2.5">Owner Name <span className="text-brand">*</span></label>
                      <input
                        type="text"
                        name="ownerName"
                        value={formData.ownerName}
                        onChange={handleChange}
                        placeholder="Michael Chen"
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-2xl px-7 py-4 text-lg focus:outline-none focus:border-brand transition-colors placeholder-zinc-500"
                      />
                      {errors.ownerName && <p className="text-brand text-sm mt-2">{errors.ownerName}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-2.5">Pincode <span className="text-brand">*</span></label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="e.g. 110001"
                        maxLength={6}
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-2xl px-7 py-4 text-lg focus:outline-none focus:border-brand transition-colors placeholder-zinc-500"
                      />
                      {errors.location && <p className="text-brand text-sm mt-2">{errors.location}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-2.5">Controller Model <span className="text-brand">*</span></label>
                    <div className="relative">
                      <select
                        name="controllerModel"
                        value={formData.controllerModel}
                        onChange={handleChange}
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-2xl px-5 sm:px-7 py-4 text-base sm:text-lg focus:outline-none focus:border-brand transition-colors appearance-none pr-10"
                      >
                        <option value="">Select controller model</option>
                        <option value="Z800">Z800</option>
                        <option value="Z1000">Z1000</option>
                        <option value="Z1000 Pro">Z1000 Pro</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                        <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>
                    {errors.controllerModel && <p className="text-brand text-sm mt-2">{errors.controllerModel}</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Shed Dimensions & Equipment */}
              <div className="space-y-10">
                <div>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="h-px w-10 bg-brand"></div>
                    <h2 className="text-3xl font-semibold tracking-tight">Shed Dimensions</h2>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-2.5">Length (ft) <span className="text-brand">*</span></label>
                      <input
                        type="number"
                        name="length"
                        value={formData.length}
                        onChange={handleChange}
                        placeholder="240"
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-2xl px-7 py-4 text-lg focus:outline-none focus:border-brand transition-colors placeholder-zinc-500"
                      />
                      {errors.length && <p className="text-brand text-sm mt-2">{errors.length}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-2.5">Width (ft) <span className="text-brand">*</span></label>
                      <input
                        type="number"
                        name="width"
                        value={formData.width}
                        onChange={handleChange}
                        placeholder="65"
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-2xl px-7 py-4 text-lg focus:outline-none focus:border-brand transition-colors placeholder-zinc-500"
                      />
                      {errors.width && <p className="text-brand text-sm mt-2">{errors.width}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-2.5">Height (ft) <span className="text-brand">*</span></label>
                      <input
                        type="number"
                        name="height"
                        value={formData.height}
                        onChange={handleChange}
                        placeholder="22"
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-2xl px-7 py-4 text-lg focus:outline-none focus:border-brand transition-colors placeholder-zinc-500"
                      />
                      {errors.height && <p className="text-brand text-sm mt-2">{errors.height}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-2.5">Current Bird Count <span className="text-brand">*</span></label>
                      <input
                        type="number"
                        name="birdCapacity"
                        value={formData.birdCapacity}
                        onChange={handleChange}
                        placeholder="18500"
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-2xl px-7 py-4 text-lg focus:outline-none focus:border-brand transition-colors placeholder-zinc-500"
                      />
                      {errors.birdCapacity && <p className="text-brand text-sm mt-2">{errors.birdCapacity}</p>}
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-zinc-400 mb-2.5">Bird Placement Date <span className="text-brand">*</span></label>
                      <input
                        type="date"
                        name="placementDate"
                        value={formData.placementDate}
                        onChange={handleChange}
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-2xl px-7 py-4 text-lg focus:outline-none focus:border-brand transition-colors text-white"
                      />
                      {errors.placementDate && <p className="text-brand text-sm mt-2">{errors.placementDate}</p>}
                    </div>
                  </div>
                </div>

                {/* Fan Configuration */}
                <div>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="h-px w-10 bg-brand"></div>
                    <h2 className="text-3xl font-semibold tracking-tight">Fan Configuration</h2>
                  </div>

                  <div className="space-y-8">
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-2.5">Fan Count <span className="text-brand">*</span></label>
                      <input
                        type="number"
                        name="fanCount"
                        value={formData.fanCount}
                        onChange={handleChange}
                        placeholder="10"
                        min="0"
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-2xl px-7 py-4 text-lg focus:outline-none focus:border-brand transition-colors placeholder-zinc-500"
                      />
                      {errors.fanCount && <p className="text-brand text-sm mt-2">{errors.fanCount}</p>}
                    </div>

                    <div>
                      {/* Segmented Selector + Tooltip */}
                      <div className="flex items-center gap-2.5 mb-3">
                        <label className="block text-sm font-medium text-zinc-400">Fan Information <span className="text-brand">*</span></label>
                        <div className="group relative flex items-center">
                          <Info size={16} className="text-zinc-500 hover:text-white transition-colors cursor-help" />
                          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 w-72 bg-zinc-900 border border-white/10 rounded-xl p-4 shadow-2xl text-xs text-zinc-300 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200 z-50 leading-relaxed">
                            Choose whichever information you already know. You can provide either the fan size or the fan CFM. The AI will calculate the remaining values automatically during recipe generation.
                            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-zinc-900"></div>
                          </div>
                        </div>
                      </div>

                      {/* Segmented Switch */}
                      <div className="relative flex p-1 bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-[280px] mb-5">
                        <button
                          type="button"
                          onClick={() => handleFanInputTypeChange('size')}
                          className={`flex-1 relative z-10 py-2.5 text-sm font-semibold rounded-xl text-center transition-colors cursor-pointer ${formData.fanInputType === 'size' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                        >
                          Fan Size
                        </button>
                        <button
                          type="button"
                          onClick={() => handleFanInputTypeChange('cfm')}
                          className={`flex-1 relative z-10 py-2.5 text-sm font-semibold rounded-xl text-center transition-colors cursor-pointer ${formData.fanInputType === 'cfm' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                        >
                          Fan CFM
                        </button>
                        <motion.div
                          className="absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] bg-brand/10 border border-brand/20 rounded-xl"
                          animate={{
                            x: formData.fanInputType === 'size' ? 0 : '100%'
                          }}
                          transition={{ type: "spring", stiffness: 350, damping: 28 }}
                        />
                      </div>

                      {/* Dynamic Inputs with transitions */}
                      <div className="overflow-hidden min-h-[100px]">
                        <AnimatePresence mode="wait">
                          {formData.fanInputType === 'size' ? (
                            <motion.div
                              key="size"
                              initial={{ opacity: 0, y: -8, scale: 0.98 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 8, scale: 0.98 }}
                              transition={{ duration: 0.2 }}
                            >
                              <label className="block text-sm font-medium text-zinc-400 mb-2.5">Fan Size</label>
                              <select
                                name="fanSize"
                                value={formData.fanSize}
                                onChange={handleChange}
                                className="w-full bg-zinc-950 border border-zinc-700 rounded-2xl px-7 py-4 text-lg focus:outline-none focus:border-brand transition-colors appearance-none"
                              >
                                <option value="">Select size</option>
                                <option value="24 Inch">24 Inch</option>
                                <option value="36 Inch">36 Inch</option>
                                <option value="48 Inch">48 Inch</option>
                                <option value="50 Inch">50 Inch</option>
                                <option value="54 Inch">54 Inch</option>
                                <option value="60 Inch">60 Inch</option>
                              </select>
                              {errors.fanSize && <p className="text-brand text-sm mt-2">{errors.fanSize}</p>}
                            </motion.div>
                          ) : (
                            <motion.div
                              key="cfm"
                              initial={{ opacity: 0, y: -8, scale: 0.98 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 8, scale: 0.98 }}
                              transition={{ duration: 0.2 }}
                            >
                              <label className="block text-sm font-medium text-zinc-400 mb-2.5">Fan CFM</label>
                              <input
                                type="number"
                                name="fanCFM"
                                value={formData.fanCFM}
                                onChange={handleChange}
                                placeholder="25000"
                                className="w-full bg-zinc-950 border border-zinc-700 rounded-2xl px-7 py-4 text-lg focus:outline-none focus:border-brand transition-colors placeholder-zinc-500"
                              />
                              {errors.fanCFM && <p className="text-brand text-sm mt-2">{errors.fanCFM}</p>}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Cooling Pad — always present, no toggle */}
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-px w-6 bg-sky-400"></div>
                        <h3 className="text-base font-semibold text-sky-400 tracking-wide">Cooling Pad</h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-zinc-400 mb-2.5">Pad Length (ft)</label>
                          <input
                            type="number"
                            name="coolingPadLength"
                            value={formData.coolingPadLength}
                            onChange={handleChange}
                            placeholder="60"
                            className="w-full bg-zinc-950 border border-zinc-700 rounded-2xl px-5 sm:px-7 py-4 text-base sm:text-lg focus:outline-none focus:border-brand transition-colors placeholder-zinc-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-zinc-400 mb-2.5">Pad Height (ft)</label>
                          <input
                            type="number"
                            name="padHeight"
                            value={formData.padHeight}
                            onChange={handleChange}
                            placeholder="6"
                            className="w-full bg-zinc-950 border border-zinc-700 rounded-2xl px-5 sm:px-7 py-4 text-base sm:text-lg focus:outline-none focus:border-brand transition-colors placeholder-zinc-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>

            {/* Action Buttons */}
            <div className="mt-10 lg:mt-16 flex flex-col sm:flex-row justify-end gap-4">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.985 }}
                onClick={handleCancel}
                className="w-full sm:w-auto px-10 py-4 text-lg border border-white/20 hover:bg-white/5 rounded-2xl transition-colors font-medium cursor-pointer text-center"
              >
                Cancel
              </motion.button>
              
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.985 }}
                onClick={handleSubmit}
                className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-brand to-brand-dark hover:brightness-110 text-lg font-semibold text-white rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-brand/20 transition-all cursor-pointer"
              >
                Continue to Preview
                <ArrowRight size={24} strokeWidth={2.5} />
              </motion.button>
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default FarmInfrastructure;