import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Colors, FontSize, FontWeight } from '@/constants/theme';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  variant?: 'icon' | 'full';
  style?: any;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'medium',
  showText = true,
  variant = 'icon',
  style,
}) => {
  const dimensions = {
    small: 40,
    medium: 60,
    large: 100,
  };

  const logoSize = dimensions[size];

  return (
    <View style={[styles.container, style]}>
      <Image
        source={variant === 'full' ? require('@/assets/images/logo-full.png') : require('@/assets/images/icon.png')}
        style={[styles.logoImage, { width: logoSize, height: logoSize }]}
        resizeMode="contain"
      />
      {showText && (
        <View style={styles.textContainer}>
          <Text style={[styles.appName, size === 'large' && styles.appNameLarge]}>
            Mepe Khai
          </Text>
          <Text style={[styles.tagline, size === 'large' && styles.taglineLarge]}>
            Measure, Track, Transform
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  logoImage: {
    // Width and height are set dynamically based on size prop
  },
  textContainer: {
    marginTop: 12,
    alignItems: 'center',
  },
  appName: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  appNameLarge: {
    fontSize: FontSize.xxl,
  },
  tagline: {
    fontSize: FontSize.sm,
    color: '#22c55e',
    marginTop: 4,
    fontWeight: FontWeight.semibold,
  },
  taglineLarge: {
    fontSize: FontSize.base,
  },
});
