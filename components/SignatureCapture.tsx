import React, { useRef, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const SignatureCapture = () => {
  const svgRef = useRef();
  const [pathData, setPathData] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);

  const handleTouchStart = (event) => {
    const { locationX, locationY } = event.nativeEvent;
    setIsDrawing(true);
    const newPathSegment = `M ${locationX} ${locationY}`;
    setPathData(newPathSegment);
  };

  const handleTouchMove = (event) => {
    if (!isDrawing) return;
    const { locationX, locationY } = event.nativeEvent;
    const newPathSegment = `L ${locationX} ${locationY}`;
    setPathData((prevPathData) => prevPathData + newPathSegment);
  };

  const handleTouchEnd = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    setPathData('');
  };

  const handleSaveAsBase64 = async () => {
    if (svgRef.current) {
      try {
        const svgData = await svgRef.current.toDataURL();
        console.log('Firma en base64:', svgData);
      } catch (error) {
        console.error('Error al capturar la firma:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Svg
        ref={svgRef}
        width="100%"
        height="100%"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Path d={pathData} fill="none" stroke="black" strokeWidth="2" />
      </Svg>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
          <Text style={styles.clearButtonText}>Clear</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveAsBase64}>
          <Text style={styles.saveButtonText}>Save as Base64</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  clearButton: {
    padding: 10,
    backgroundColor: 'red',
    marginRight: 10,
  },
  clearButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  saveButton: {
    padding: 10,
    backgroundColor: 'green',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default SignatureCapture;
