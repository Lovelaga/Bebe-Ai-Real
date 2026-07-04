# Machine Learning Integration Guide

## Supported Frameworks

### TensorFlow.js
```javascript
const tf = require('@tensorflow/tfjs');
const model = await tf.loadLayersModel('file://./model/model.json');
const prediction = model.predict(tf.tensor([...]));
```

## Data Preprocessing
```javascript
const DataPreprocessor = require('./ai/utils/preprocessing');
const normalized = DataPreprocessor.normalize(data);
```

## Model Formats
- TensorFlow SavedModel (.pb)
- ONNX (.onnx)
- PyTorch (.pth)
- TensorFlow.js (.json, .bin)

## Resources
- [TensorFlow.js Guide](https://www.tensorflow.org/js)
- [Model Hub](https://tfhub.dev)
