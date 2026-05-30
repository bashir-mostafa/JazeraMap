// src/app/index.tsx
import { useEffect } from 'react';
import { router } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
  useEffect(() => {
    // التحقق من وجود توكن والمستخدم
    const checkAuth = async () => {
      // هنا يمكنك التحقق من وجود توكن صالح
      const isAuthenticated = false; // مؤقت للاختبار
      
      if (isAuthenticated) {
        router.replace('/');
      } else {
        router.replace('/login');
      }
    };
    
    checkAuth();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#4CAF50" />
    </View>
  );
}