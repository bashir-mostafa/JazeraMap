// src/app/(tabs)/map.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { mapStyles } from '@/styles/map.styles';

export default function MapScreen() {
  return (
    <SafeAreaView style={mapStyles.safeArea}>
      <View style={mapStyles.container}>
        <Text style={mapStyles.placeholderTitle}>🗺️ الخريطة</Text>
        <Text style={mapStyles.placeholderText}>
          قريباً... يمكنك رؤية الأماكن على الخريطة
        </Text>
        <TouchableOpacity style={mapStyles.locationButton}>
          <Text style={mapStyles.locationButtonText}>📍 تحديد موقعي</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}