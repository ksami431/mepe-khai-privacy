import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { ProgressBar } from '@/components/ProgressBar';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';

type DietaryPreference = 'none' | 'vegetarian' | 'vegan' | 'pescatarian' | 'keto' | 'paleo';

export default function PreferencesScreen() {
  const router = useRouter();
  const { data, updatePreferences } = useOnboarding();
  const [dietaryPreference, setDietaryPreference] = useState<DietaryPreference>(data.dietaryPreference);
  const [allergies, setAllergies] = useState(data.allergies);

  const handleComplete = () => {
    // Store preferences and navigate to complete screen
    updatePreferences({
      dietaryPreference,
      allergies,
    });
    
    router.push('/(onboarding)/complete');
  };

  const dietOptions = [
    { value: 'none', label: 'None', icon: '🍽️' },
    { value: 'vegetarian', label: 'Vegetarian', icon: '🥗' },
    { value: 'vegan', label: 'Vegan', icon: '🌱' },
    { value: 'pescatarian', label: 'Pescatarian', icon: '🐟' },
    { value: 'keto', label: 'Keto', icon: '🥑' },
    { value: 'paleo', label: 'Paleo', icon: '🥩' },
  ];

  return (
    <View style={styles.container}>
      <ProgressBar current={5} total={5} />
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <Text style={styles.title}>Dietary preferences</Text>
          <Text style={styles.subtitle}>
            Help us provide better food recommendations (optional).
          </Text>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Dietary Preference</Text>
            <View style={styles.dietOptions}>
              {dietOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.dietOption,
                    dietaryPreference === option.value && styles.dietOptionSelected,
                  ]}
                  onPress={() => setDietaryPreference(option.value as DietaryPreference)}
                >
                  <Text style={styles.dietIcon}>{option.icon}</Text>
                  <Text
                    style={[
                      styles.dietLabel,
                      dietaryPreference === option.value && styles.dietLabelSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Input
              label="Allergies or Restrictions (Optional)"
              value={allergies}
              onChangeText={setAllergies}
              placeholder="e.g., Peanuts, Dairy, Gluten"
              multiline
              numberOfLines={3}
              style={styles.textArea}
            />
            <Text style={styles.helperText}>
              This helps us flag potential allergens in your food logs.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button title="Complete Setup" onPress={handleComplete} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSize.base,
    color: Colors.textLight,
    marginBottom: Spacing.xl,
    lineHeight: 22,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionLabel: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  dietOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  dietOption: {
    width: '31%',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    alignItems: 'center',
  },
  dietOptionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  dietIcon: {
    fontSize: 28,
    marginBottom: Spacing.xs,
  },
  dietLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.text,
    textAlign: 'center',
  },
  dietLabelSelected: {
    color: Colors.white,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  helperText: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },
  buttonContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
});
