// src/app/(tabs)/search.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { searchStyles } from '../../styles/search.styles';
import { mockPlaces } from '../../mock/data';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text) {
      const filtered = mockPlaces.filter(place =>
        place.name.toLowerCase().includes(text.toLowerCase())
      );
      setResults(filtered as any);
    } else {
      setResults([]);
    }
  };

  return (
    <SafeAreaView style={searchStyles.safeArea}>
      <View style={searchStyles.searchContainer}>
        <TextInput
          style={searchStyles.searchInput}
          placeholder="ابحث عن مطعم، مقهى، أو مكان..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
        <Text style={searchStyles.searchIcon}>🔍</Text>
      </View>
      
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }: any) => (
          <TouchableOpacity style={searchStyles.resultItem}>
            <Text style={searchStyles.resultName}>{item.name}</Text>
            <Text style={searchStyles.resultCategory}>{item.category}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          searchQuery ? (
            <Text style={searchStyles.emptyText}>لا توجد نتائج</Text>
          ) : null
        }
      />
    </SafeAreaView>
  );
}