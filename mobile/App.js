import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';

export default function App() {
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { fetchApiData(); }, []);

  const fetchApiData = async () => {
    try {
      const response = await axios.get('http://10.0.2.2:3001/api/info');
      setApiData(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🤖 Bebe AI Real</Text>
        <Text style={styles.subtitle}>Advanced AI Application</Text>
        <Text style={styles.status}>Mobile App Running</Text>
      </View>
      <View style={styles.content}>
        {loading && <Text style={styles.text}>Loading API data...</Text>}
        {error && <Text style={styles.error}>Error: {error}</Text>}
        {apiData && (
          <View style={styles.apiInfo}>
            <Text style={styles.heading}>Backend Status:</Text>
            <Text style={styles.text}>Service: {apiData.service}</Text>
            <Text style={styles.text}>Version: {apiData.version}</Text>
            <Text style={styles.text}>Status: {apiData.status}</Text>
          </View>
        )}
        <TouchableOpacity style={styles.button} onPress={fetchApiData}>
          <Text style={styles.buttonText}>Refresh</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { backgroundColor: '#667eea', paddingTop: 40, paddingBottom: 40, paddingHorizontal: 20, alignItems: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#fff', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#fff', marginBottom: 10 },
  status: { fontSize: 14, color: '#fff', opacity: 0.9 },
  content: { paddingHorizontal: 20, paddingVertical: 20 },
  heading: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  text: { fontSize: 16, color: '#666', marginBottom: 10 },
  error: { fontSize: 16, color: '#ff6b6b', marginBottom: 10 },
  apiInfo: { backgroundColor: '#f5f5f5', padding: 15, borderRadius: 8, marginBottom: 20 },
  button: { backgroundColor: '#667eea', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
