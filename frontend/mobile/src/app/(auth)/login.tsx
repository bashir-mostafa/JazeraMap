// src/app/login.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  TextInput,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

// ============================================
// COLORS - نظام الألوان
// ============================================
const COLORS = {
  primary: '#0B1220',
  accent: '#16A34A',
  background: '#FFFFFF',
  text: '#111827',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  error: '#EF4444',
  success: '#10B981',
  google: '#DB4437',
  facebook: '#4267B2',
  apple: '#000000',
  disabled: '#9CA3AF',
  lightGray: '#F9FAFB',
};

// ============================================
// SPACING - نظام المسافات
// ============================================
const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

// ============================================
// TYPOGRAPHY - نظام الطباعة
// ============================================
const TYPOGRAPHY = {
  h1: { fontSize: 32, fontWeight: '700' as const, lineHeight: 40 },
  h2: { fontSize: 24, fontWeight: '600' as const, lineHeight: 32 },
  h3: { fontSize: 20, fontWeight: '600' as const, lineHeight: 28 },
  body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  caption: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  small: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
  button: { fontSize: 16, fontWeight: '600' as const, lineHeight: 24 },
};

// ============================================
// PROPS TYPES - أنواع props للمكونات
// ============================================
interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  error?: string;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'outline' | 'social';
}

// ============================================
// COMPONENTS - مكونات قابلة لإعادة الاستخدام
// ============================================

// مكون حقل الإدخال
const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  error,
  keyboardType = 'default',
  autoCapitalize = 'none',
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.inputContainer}>
      <Text style={[styles.inputLabel, isFocused && styles.inputLabelFocused]}>
        {label}
      </Text>
      <View style={[styles.inputWrapper, isFocused && styles.inputWrapperFocused, error && styles.inputWrapperError]}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textSecondary}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {secureTextEntry && (
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowPassword(!showPassword)}>
            <Text style={styles.eyeButtonText}>
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

// مكون الزر
const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
}) => {
  const buttonStyles = [
    styles.button,
    variant === 'primary' && styles.buttonPrimary,
    variant === 'outline' && styles.buttonOutline,
    variant === 'social' && styles.buttonSocial,
    disabled && styles.buttonDisabled,
  ];

  const textStyles = [
    styles.buttonText,
    variant === 'primary' && styles.buttonTextPrimary,
    variant === 'outline' && styles.buttonTextOutline,
    variant === 'social' && styles.buttonTextSocial,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}>
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? COLORS.background : COLORS.accent} />
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

// ============================================
// MAIN SCREEN - شاشة تسجيل الدخول الرئيسية
// ============================================
export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  // التحقق من صحة النموذج
  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'البريد الإلكتروني غير صالح';
    }

    if (!password) {
      newErrors.password = 'كلمة المرور مطلوبة';
    } else if (password.length < 6) {
      newErrors.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // معالجة تسجيل الدخول
  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);

    // محاكاة طلب API - سيتم استبداله بالاتصال الحقيقي
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'تم بنجاح',
        'تم تسجيل الدخول بنجاح',
        [{ text: 'حسناً', onPress: () => router.replace('/home') }]
      );
    }, 1500);
  };

  // معالجة نسيت كلمة المرور
  const handleForgotPassword = () => {
    router.push('/forgot-password');
  };

  // معالجة التسجيل
  const handleRegister = () => {
    router.push('/register');
  };

  // معالجة تسجيل الدخول عبر وسائل التواصل
  const handleSocialLogin = (provider: string) => {
    Alert.alert('قريباً', `تسجيل الدخول عبر ${provider} سيتم إضافته قريباً`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          
          {/* Logo Section - قسم الشعار */}
          <View style={styles.logoSection}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoEmoji}>🗺️</Text>
            </View>
            <Text style={styles.appName}>خرائط الجزيرة</Text>
            <Text style={styles.appSubtitle}>
              اكتشف الأماكن، قيّمها، وشارك تجربتك
            </Text>
          </View>

          {/* Welcome Section - قسم الترحيب */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>مرحباً بعودتك</Text>
            <Text style={styles.welcomeDescription}>
              سجل الدخول للوصول إلى حسابك
            </Text>
          </View>

          {/* Login Form - نموذج تسجيل الدخول */}
          <View style={styles.formSection}>
            <InputField
              label="البريد الإلكتروني"
              value={email}
              onChangeText={setEmail}
              placeholder="example@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />

            <InputField
              label="كلمة المرور"
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry
              error={errors.password}
            />

            {/* Forgot Password - نسيت كلمة المرور */}
            <TouchableOpacity
              style={styles.forgotPasswordContainer}
              onPress={handleForgotPassword}>
              <Text style={styles.forgotPasswordText}>نسيت كلمة المرور؟</Text>
            </TouchableOpacity>

            {/* Login Button - زر تسجيل الدخول */}
            <Button
              title="تسجيل الدخول"
              onPress={handleLogin}
              loading={loading}
              disabled={loading}
              variant="primary"
            />
          </View>

          {/* Divider - فاصل */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>أو المتابعة باستخدام</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Login Buttons - أزرار وسائل التواصل */}
          <View style={styles.socialSection}>
            <TouchableOpacity
              style={[styles.socialButton, styles.googleButton]}
              onPress={() => handleSocialLogin('Google')}>
              <Text style={styles.socialIcon}>G</Text>
              <Text style={styles.socialButtonText}>Google</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.socialButton, styles.appleButton]}
              onPress={() => handleSocialLogin('Apple')}>
              <Text style={styles.socialIcon}>🍎</Text>
              <Text style={styles.socialButtonText}>Apple</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.socialButton, styles.facebookButton]}
              onPress={() => handleSocialLogin('Facebook')}>
              <Text style={styles.socialIcon}>f</Text>
              <Text style={styles.socialButtonText}>Facebook</Text>
            </TouchableOpacity>
          </View>

          {/* Register Link - رابط التسجيل */}
          <View style={styles.registerSection}>
            <Text style={styles.registerText}>ليس لديك حساب؟</Text>
            <TouchableOpacity onPress={handleRegister}>
              <Text style={styles.registerLink}> إنشاء حساب</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ============================================
// STYLES - الأنماط
// ============================================
const styles = StyleSheet.create({
  // Container Styles
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xxl,
  },

  // Logo Section
  logoSection: {
    alignItems: 'center',
    marginTop: SPACING.xxxl,
    marginBottom: SPACING.xxxl,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.accent + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  logoEmoji: {
    fontSize: 50,
  },
  appName: {
    ...TYPOGRAPHY.h1,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  appSubtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingHorizontal: SPACING.xl,
  },

  // Welcome Section
  welcomeSection: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  welcomeTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  welcomeDescription: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },

  // Form Section
  formSection: {
    marginBottom: SPACING.xl,
  },
  inputContainer: {
    marginBottom: SPACING.lg,
  },
  inputLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
    fontWeight: '500',
  },
  inputLabelFocused: {
    color: COLORS.accent,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 16,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.background,
    minHeight: 56,
  },
  inputWrapperFocused: {
    borderColor: COLORS.accent,
    borderWidth: 2,
  },
  inputWrapperError: {
    borderColor: COLORS.error,
  },
  input: {
    flex: 1,
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    paddingVertical: SPACING.md,
    textAlign: 'right',
  },
  eyeButton: {
    padding: SPACING.sm,
  },
  eyeButtonText: {
    fontSize: 18,
  },
  errorText: {
    ...TYPOGRAPHY.small,
    color: COLORS.error,
    marginTop: SPACING.xs,
    marginRight: SPACING.sm,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: SPACING.xl,
  },
  forgotPasswordText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.accent,
    fontWeight: '600',
  },

  // Button Styles
  button: {
    borderRadius: 16,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  buttonPrimary: {
    backgroundColor: COLORS.accent,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.accent,
  },
  buttonSocial: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
    borderWidth: 1,
    borderColor: COLORS.border,
    minHeight: 48,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    ...TYPOGRAPHY.button,
  },
  buttonTextPrimary: {
    color: COLORS.background,
  },
  buttonTextOutline: {
    color: COLORS.accent,
  },
  buttonTextSocial: {
    color: COLORS.text,
  },

  // Divider Styles
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginHorizontal: SPACING.md,
  },

  // Social Section
  socialSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.md,
    marginBottom: SPACING.xxl,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
  },
  googleButton: {
    backgroundColor: COLORS.google,
  },
  appleButton: {
    backgroundColor: COLORS.apple,
  },
  facebookButton: {
    backgroundColor: COLORS.facebook,
  },
  socialIcon: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.background,
  },
  socialButtonText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '600',
    color: COLORS.background,
  },

  // Register Section
  registerSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  registerText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  registerLink: {
    ...TYPOGRAPHY.body,
    color: COLORS.accent,
    fontWeight: '700',
  },
});