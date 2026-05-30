// src/app/(tabs)/profile.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { profileStyles } from '@/styles/profile.styles';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const menuItems = [
    { icon: '👤', title: 'الملف الشخصي', onPress: () => {} },
    { icon: '⭐', title: 'تقييماتي', onPress: () => {} },
    { icon: '❤️', title: 'المفضلة', onPress: () => {} },
    { icon: '⚙️', title: 'الإعدادات', onPress: () => {} },
    { icon: '🚪', title: 'تسجيل الخروج', onPress: () => router.replace('/login') },
  ];

  return (
    <SafeAreaView style={profileStyles.safeArea}>
      <View style={profileStyles.header}>
        <View style={profileStyles.avatar}>
          <Text style={profileStyles.avatarText}>👤</Text>
        </View>
        <Text style={profileStyles.userName}>أحمد</Text>
        <Text style={profileStyles.userEmail}>ahmed@example.com</Text>
      </View>

      <View style={profileStyles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={profileStyles.menuItem}
            onPress={item.onPress}>
            <Text style={profileStyles.menuIcon}>{item.icon}</Text>
            <Text style={profileStyles.menuTitle}>{item.title}</Text>
            <Text style={profileStyles.menuArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}