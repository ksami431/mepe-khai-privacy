import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Button } from './Button';
import { Card } from './Card';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';

interface RecipeInputProps {
  onAnalyze: (recipeText: string) => void;
  onCancel: () => void;
  analyzing: boolean;
}

export const RecipeInput: React.FC<RecipeInputProps> = ({ onAnalyze, onCancel, analyzing }) => {
  const [recipeText, setRecipeText] = useState('');

  const handleAnalyze = () => {
    if (recipeText.trim().length < 20) {
      return;
    }
    onAnalyze(recipeText);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Card style={styles.card}>
          <Text style={styles.icon}>📋</Text>
          <Text style={styles.title}>Recipe Analysis</Text>
          <Text style={styles.description}>
            Paste your recipe (ingredients and instructions) and we'll calculate the full nutrition.
          </Text>
        </Card>

        <Card style={styles.inputCard}>
          <Text style={styles.inputLabel}>Recipe Text</Text>
          <TextInput
            style={styles.textInput}
            value={recipeText}
            onChangeText={setRecipeText}
            placeholder="Paste your recipe here...

Example:
Ingredients:
- 2 chicken breasts
- 1 cup rice
- 2 tbsp olive oil
- Salt and pepper

Instructions:
1. Cook rice
2. Season and grill chicken
3. Serve together"
            placeholderTextColor={Colors.textMuted}
            multiline
            numberOfLines={15}
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>
            {recipeText.length} characters (min 20 required)
          </Text>
        </Card>

        <View style={styles.buttonContainer}>
          <Button
            title={analyzing ? 'Analyzing...' : 'Analyze Recipe'}
            onPress={handleAnalyze}
            disabled={recipeText.trim().length < 20 || analyzing}
          />
          <Button
            title="Cancel"
            onPress={onCancel}
            variant="outline"
            disabled={analyzing}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundGray,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
  },
  card: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  icon: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  description: {
    fontSize: FontSize.base,
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: 22,
  },
  inputCard: {
    marginBottom: Spacing.lg,
  },
  inputLabel: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  textInput: {
    fontSize: FontSize.base,
    color: Colors.text,
    backgroundColor: Colors.backgroundGray,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    minHeight: 300,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  charCount: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
    textAlign: 'right',
  },
  buttonContainer: {
    gap: Spacing.md,
  },
});
