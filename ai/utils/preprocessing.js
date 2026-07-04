const tf = require('@tensorflow/tfjs');

class DataPreprocessor {
  static normalize(data, min = null, max = null) {
    const tensor = tf.tensor(data);
    if (min === null || max === null) {
      const minVal = tensor.min();
      const maxVal = tensor.max();
      const normalized = tensor.sub(minVal).div(maxVal.sub(minVal));
      return { data: normalized.arraySync(), min: minVal.dataSync()[0], max: maxVal.dataSync()[0] };
    }
    return tensor.sub(min).div(max - min).arraySync();
  }

  static standardize(data) {
    const tensor = tf.tensor(data);
    const mean = tensor.mean();
    const variance = tensor.sub(mean).square().mean();
    const std = variance.sqrt();
    return tensor.sub(mean).div(std).arraySync();
  }

  static reshape(data, shape) {
    return tf.tensor(data).reshape(shape).arraySync();
  }

  static batch(data, batchSize) {
    const batches = [];
    for (let i = 0; i < data.length; i += batchSize) batches.push(data.slice(i, i + batchSize));
    return batches;
  }
}

module.exports = DataPreprocessor;
