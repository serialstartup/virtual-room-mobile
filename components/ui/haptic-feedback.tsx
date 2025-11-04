import * as Haptics from 'expo-haptics';

export interface HapticFeedbackOptions {
  type?: 'success' | 'warning' | 'error' | 'light' | 'medium' | 'heavy' | 'selection';
  duration?: number;
}

export const HapticFeedback = {
  success: () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  },

  warning: () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  },

  error: () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  },

  light: () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  },

  medium: () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  },

  heavy: () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  },

  selection: () => {
    Haptics.selectionAsync();
  },

  trigger: (type: HapticFeedbackOptions['type'] = 'light') => {
    switch (type) {
      case 'success':
        HapticFeedback.success();
        break;
      case 'warning':
        HapticFeedback.warning();
        break;
      case 'error':
        HapticFeedback.error();
        break;
      case 'light':
        HapticFeedback.light();
        break;
      case 'medium':
        HapticFeedback.medium();
        break;
      case 'heavy':
        HapticFeedback.heavy();
        break;
      case 'selection':
        HapticFeedback.selection();
        break;
      default:
        HapticFeedback.light();
    }
  }
};