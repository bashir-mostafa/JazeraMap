// src/app/(tabs)/favorites.tsx
import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { favoritesStyles } from '@/styles/favorites.styles';

export default function FavoritesScreen() {
  const favorites = []; // ستأتي من AsyncStorage

  if (favorites.length === 0) {
    return (
      <SafeAreaView style={favoritesStyles.safeArea}>
        <View style={favoritesStyles.emptyContainer}>
          <Text style={favoritesStyles.emptyIcon}>❤️</Text>
          <Text style={favoritesStyles.emptyTitle}>لا توجد مفضلات</Text>
          <Text style={favoritesStyles.emptyText}>
            أضف أماكنك المفضلة لتظهر هنا
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={favoritesStyles.safeArea}>
      <FlatList
        data={favorites}
        renderItem={({ item }) => (
          <View>
            {/* عرض الأماكن المفضلة */}
          </View>
        )}
      />
    </SafeAreaView>
  );
}