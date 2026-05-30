// src/app/(tabs)/index.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { homeStyles } from '@/styles/home.styles';
import { COLORS } from '@/constants/theme';
import { mockPlaces, categories } from '@/mock/data';

// ============================================
// COMPONENTS
// ============================================
const CategoryChip = ({ category, isActive, onPress }: any) => (
  <TouchableOpacity
    style={[homeStyles.categoryChip, isActive && homeStyles.categoryChipActive]}
    onPress={onPress}>
    <Text style={[homeStyles.categoryText, isActive && homeStyles.categoryTextActive]}>
      {category.icon} {category.name}
    </Text>
  </TouchableOpacity>
);

const PlaceCard = ({ place, onPress }: any) => (
  <TouchableOpacity style={homeStyles.placeCard} onPress={onPress}>
    <Image source={{ uri: place.image }} style={homeStyles.placeImage} />
    <View style={homeStyles.placeContent}>
      <Text style={homeStyles.placeName}>{place.name}</Text>
      <View style={homeStyles.placeRating}>
        <Text style={homeStyles.ratingText}>⭐ {place.rating}</Text>
        <Text style={homeStyles.reviewText}>({place.reviews} تقييم)</Text>
      </View>
      <Text style={homeStyles.placeCategory}>{place.category}</Text>
    </View>
  </TouchableOpacity>
);

// ============================================
// MAIN SCREEN
// ============================================
export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const filteredPlaces = selectedCategory === 'all'
    ? mockPlaces
    : mockPlaces.filter(p => p.category === selectedCategory);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  return (
    <SafeAreaView style={homeStyles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        
        {/* Header */}
        <View style={homeStyles.header}>
          <View>
            <Text style={homeStyles.greeting}>مرحباً 👋</Text>
            <Text style={homeStyles.userName}>أحمد</Text>
          </View>
          <TouchableOpacity style={homeStyles.notificationButton}>
            <Text style={homeStyles.notificationIcon}>🔔</Text>
            <View style={homeStyles.notificationBadge} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <TouchableOpacity style={homeStyles.searchBar}>
          <Text style={homeStyles.searchIcon}>🔍</Text>
          <Text style={homeStyles.searchText}>ابحث عن مكان...</Text>
        </TouchableOpacity>

        {/* Categories */}
        <View style={homeStyles.categoriesSection}>
          <Text style={homeStyles.sectionTitle}>الفئات</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={homeStyles.categoriesContainer}>
              {categories.map((category) => (
                <CategoryChip
                  key={category.id}
                  category={category}
                  isActive={selectedCategory === category.id}
                  onPress={() => setSelectedCategory(category.id)}
                />
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Featured Places */}
        <View style={homeStyles.placesSection}>
          <Text style={homeStyles.sectionTitle}>
            {selectedCategory === 'all' ? 'أماكن قريبة منك' : 'نتائج البحث'}
          </Text>
          {filteredPlaces.map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              onPress={() => console.log('Navigate to place:', place.id)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}