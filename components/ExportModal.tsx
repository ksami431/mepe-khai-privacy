import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Alert } from 'react-native';
import { Card } from './Card';
import { Button } from './Button';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';

interface ExportModalProps {
  visible: boolean;
  onClose: () => void;
  onExportCSV: () => Promise<void>;
  onExportPDF: () => Promise<void>;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  visible,
  onClose,
  onExportCSV,
  onExportPDF,
}) => {
  const [exporting, setExporting] = useState(false);

  const handleExport = async (type: 'csv' | 'pdf') => {
    setExporting(true);
    try {
      if (type === 'csv') {
        await onExportCSV();
      } else {
        await onExportPDF();
      }
      Alert.alert('Success', `Your data has been exported as ${type.toUpperCase()}`);
      onClose();
    } catch (error: any) {
      Alert.alert('Export Failed', error.message || 'Failed to export data');
    } finally {
      setExporting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
          <Card style={styles.modal}>
            <Text style={styles.title}>📥 Export Your Data</Text>
            <Text style={styles.description}>
              Download your food logs, weight logs, and statistics
            </Text>

            <View style={styles.options}>
              <TouchableOpacity
                style={styles.option}
                onPress={() => handleExport('csv')}
                disabled={exporting}
              >
                <Text style={styles.optionIcon}>📊</Text>
                <View style={styles.optionText}>
                  <Text style={styles.optionTitle}>CSV Export</Text>
                  <Text style={styles.optionDescription}>
                    Spreadsheet format for Excel/Sheets
                  </Text>
                </View>
                <Text style={styles.arrow}>→</Text>
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity
                style={styles.option}
                onPress={() => handleExport('pdf')}
                disabled={exporting}
              >
                <Text style={styles.optionIcon}>📄</Text>
                <View style={styles.optionText}>
                  <Text style={styles.optionTitle}>HTML Report</Text>
                  <Text style={styles.optionDescription}>
                    Formatted report with charts
                  </Text>
                </View>
                <Text style={styles.arrow}>→</Text>
              </TouchableOpacity>
            </View>

            <Button
              title={exporting ? 'Exporting...' : 'Cancel'}
              onPress={onClose}
              variant="outline"
              disabled={exporting}
            />
          </Card>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  modal: {
    width: '100%',
    maxWidth: 400,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  description: {
    fontSize: FontSize.base,
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    lineHeight: 22,
  },
  options: {
    marginBottom: Spacing.lg,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  optionIcon: {
    fontSize: 32,
    marginRight: Spacing.md,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: FontSize.sm,
    color: Colors.textLight,
  },
  arrow: {
    fontSize: FontSize.xl,
    color: Colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: Spacing.xs,
  },
});
