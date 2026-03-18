import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

interface MealTypeSelectorProps {
  selectedType: MealType | null;
  onSelect: (type: MealType | null) => void;
  style?: any;
}

const MEAL_TYPES = [
  { value: 'breakfast' as MealType, label: 'Breakfast', icon: '🌅' },
  { value: 'lunch' as MealType, label: 'Lunch', icon: '🌞' },
  { value: 'dinner' as MealType, label: 'Dinner', icon: '🌙' },
  { value: 'snack' as MealType, label: 'Snack', icon: '🍎' },
];

export const MealTypeSelector: React.FC<MealTypeSelectorProps> = ({
  selectedType,
  onSelect,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>Meal Type (Optional)</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {MEAL_TYPES.map((type) => (
          <TouchableOpacity
            key={type.value}
            style={[
              styles.typeChip,
              selectedType === type.value && styles.typeChipSelected,
            ]}
            onPress={() => onSelect(selectedType === type.value ? null : type.value)}
          >
            <Text style={styles.typeIcon}>{type.icon}</Text>
            <Text
              style={[
                styles.typeLabel,
                selectedType === type.value && styles.typeLabelSelected,
              ]}
            >
              {type.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.md,
  },
  label: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  scrollContent: {
    gap: Spacing.sm,
  },
  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
    backgroundColor: Colors.white,
  },
  typeChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  typeIcon: {
    fontSize: 18,
    marginRight: Spacing.xs,
  },
  typeLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.text,
  },
  typeLabelSelected: {
    color: Colors.white,
  },
});
