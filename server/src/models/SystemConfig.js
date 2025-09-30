const mongoose = require('mongoose');

const systemConfigSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  type: {
    type: String,
    enum: ['string', 'number', 'boolean', 'object', 'array'],
    required: true
  },
  category: {
    type: String,
    required: true,
    index: true
  },
  description: {
    type: String,
    required: true
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  validation: {
    required: { type: Boolean, default: false },
    min: Number,
    max: Number,
    pattern: String,
    options: [String]
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Indexes
systemConfigSchema.index({ category: 1 });
systemConfigSchema.index({ isPublic: 1 });

// Static method to get config value
systemConfigSchema.statics.getValue = async function(key, defaultValue = null) {
  try {
    const config = await this.findOne({ key });
    return config ? config.value : defaultValue;
  } catch (error) {
    return defaultValue;
  }
};

// Static method to set config value
systemConfigSchema.statics.setValue = async function(key, value, updatedBy) {
  try {
    const config = await this.findOneAndUpdate(
      { key },
      { value, updatedBy },
      { new: true, upsert: false }
    );
    return config;
  } catch (error) {
    throw new Error(`Failed to update config: ${error.message}`);
  }
};

// Static method to get public configs
systemConfigSchema.statics.getPublicConfigs = async function() {
  try {
    const configs = await this.find({ isPublic: true }).select('key value type');
    const result = {};
    configs.forEach(config => {
      result[config.key] = config.value;
    });
    return result;
  } catch (error) {
    return {};
  }
};

module.exports = mongoose.model('SystemConfig', systemConfigSchema);