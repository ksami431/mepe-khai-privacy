import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Button } from './Button';
import { useTheme } from '@/contexts/ThemeContext';
import { Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';

interface WeightEntryModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (weight: number) => Promise<void>;
  currentWeight?: number;
}

export function WeightEntryModal({ visible, onClose, onSave, currentWeight }: WeightEntryModalProps) {
  const { theme } = useTheme();
  const [weight, setWeight] = useState(currentWeight?.toString() || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const weightNum = parseFloat(weight);
    
    if (!weight || isNaN(weightNum) || weightNum <= 0 || weightNum > 300) {
      Alert.alert('Invalid Weight', 'Please enter a valid weight between 0 and 300 kg');
      return;
    }

    setSaving(true);
    try {
      await onSave(weightNum);
      setWeight('');
      onClose();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save weight');
    } finally {
      setSaving(false);
    }
  };

  const styles = createStyles(theme);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Log Weight</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Text style={styles.emoji}>⚖️</Text>
            <Text style={styles.label}>Current Weight (kg)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your weight"
              placeholderTextColor={theme.textMuted}
              keyboardType="decimal-pad"
              value={weight}
              onChangeText={setWeight}
              autoFocus
            />

            <View style={styles.quickOptions}>
              <Text style={styles.quickLabel}>Quick adjust:</Text>
              <View style={styles.quickButtons}>
                <TouchableOpacity
                  style={styles.quickButton}
                  onPress={() => {
                    const current = parseFloat(weight) || currentWeight || 70;
                    setWeight((current - 0.5).toFixed(1));
                  }}
                >
                  <Text style={styles.quickButtonText}>-0.5</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.quickButton}
                  onPress={() => {
                    const current = parseFloat(weight) || currentWeight || 70;
                    setWeight((current + 0.5).toFixed(1));
                  }}
                >
                  <Text style={styles.quickButtonText}>+0.5</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.actions}>
            <Button
              title="Cancel"
              onPress={onClose}
              variant="outline"
              style={styles.button}
            />
            <Button
              title="Save Weight"
              onPress={handleSave}
              loading={saving}
              disabled={saving || !weight}
              style={styles.button}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: theme.cardBackground,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    paddingBottom: Spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.borderLight,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: theme.text,
  },
  closeButton: {
    fontSize: 24,
    color: theme.textLight,
    padding: Spacing.xs,
  },
  content: {
    padding: Spacing.lg,
    alignItems: 'center',
  },
  emoji: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: theme.text,
    marginBottom: Spacing.sm,
    alignSelf: 'flex-start',
  },
  input: {
    width: '100%',
    backgroundColor: theme.white,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: theme.text,
    borderWidth: 1,
    borderColor: theme.borderLight,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  quickOptions: {
    width: '100%',
    marginTop: Spacing.sm,
  },
  quickLabel: {
    fontSize: FontSize.sm,
    color: theme.textLight,
    marginBottom: Spacing.xs,
  },
  quickButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  quickButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: theme.borderLight,
    alignItems: 'center',
  },
  quickButtonText: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: theme.primary,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
  button: {
    flex: 1,
  },
});
