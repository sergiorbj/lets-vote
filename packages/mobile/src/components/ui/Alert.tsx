import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { colors } from '../../constants/colors';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
  type?: AlertType;
  title?: string;
  message: string;
  onDismiss?: () => void;
}

const typeConfig: Record<AlertType, { bg: string; border: string; text: string; icon: string }> = {
  success: {
    bg: colors.success[50],
    border: colors.success[300],
    text: colors.success[700],
    icon: '✓',
  },
  error: {
    bg: colors.error[50],
    border: colors.error[300],
    text: colors.error[700],
    icon: '✕',
  },
  warning: {
    bg: '#fffbeb',
    border: '#fcd34d',
    text: '#b45309',
    icon: '⚠',
  },
  info: {
    bg: '#eff6ff',
    border: '#93c5fd',
    text: '#1d4ed8',
    icon: 'ℹ',
  },
};

export const Alert: React.FC<AlertProps> = ({ type = 'info', title, message, onDismiss }) => {
  const config = typeConfig[type];

  return (
    <View style={[styles.container, { backgroundColor: config.bg, borderLeftColor: config.border }]}>
      <View style={styles.iconContainer}>
        <Text style={[styles.icon, { color: config.text }]}>{config.icon}</Text>
      </View>
      <View style={styles.content}>
        {title && <Text style={[styles.title, { color: config.text }]}>{title}</Text>}
        <Text style={[styles.message, { color: config.text }]}>{message}</Text>
      </View>
      {onDismiss && (
        <TouchableOpacity onPress={onDismiss} style={styles.dismissButton}>
          <Text style={[styles.dismissText, { color: config.text }]}>×</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    marginBottom: 12,
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  icon: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  message: {
    fontSize: 13,
    lineHeight: 18,
  },
  dismissButton: {
    padding: 4,
    marginLeft: 8,
  },
  dismissText: {
    fontSize: 20,
    fontWeight: 'bold',
    opacity: 0.6,
  },
});

