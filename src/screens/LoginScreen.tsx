import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  Avatar,
  Portal,
  Dialog,
  RadioButton,
} from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { loginUser } from '../store/userSlice';
import { theme } from '../theme/theme';

interface LoginScreenProps {
  navigation: any;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('');
  const [role, setRole] = useState('student');
  const [isRegistering, setIsRegistering] = useState(false);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const departments = [
    'Computer Science & Engineering',
    'Electronics & Communication Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Information Technology',
    'Electrical Engineering',
    'Electronics & Instrumentation Engineering',
    'Chemical Engineering',
    'Management',
    'Administration',
  ];

  const handleLogin = () => {
    if (!email || !password) {
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const user = {
        id: Date.now().toString(),
        name: name || 'YCCE User',
        email,
        phone: phone || '9999999999',
        department: department || 'Computer Science & Engineering',
        role: role as 'student' | 'faculty' | 'admin',
        isLoggedIn: true,
      };
      
      dispatch(loginUser(user));
      setLoading(false);
      navigation.replace('Main');
    }, 1500);
  };

  const handleRegister = () => {
    if (!email || !password || !name || !phone || !department) {
      return;
    }
    setShowRoleDialog(true);
  };

  const confirmRegistration = () => {
    setShowRoleDialog(false);
    handleLogin();
  };

  return (
    <ImageBackground
      source={{
        uri: 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      }}
      style={styles.backgroundImage}
      blurRadius={3}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.logoContainer}>
            <Avatar.Text
              size={80}
              label="YCCE"
              style={styles.logo}
              labelStyle={styles.logoText}
            />
            <Text variant="headlineMedium" style={styles.title}>
              YCCE Auditorium Booking
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
              Book auditorium for events and activities
            </Text>
          </View>

          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleLarge" style={styles.cardTitle}>
                {isRegistering ? 'Create Account' : 'Welcome Back'}
              </Text>

              {isRegistering && (
                <>
                  <TextInput
                    label="Full Name"
                    value={name}
                    onChangeText={setName}
                    mode="outlined"
                    style={styles.input}
                    left={<TextInput.Icon icon="account" />}
                  />
                  <TextInput
                    label="Phone Number"
                    value={phone}
                    onChangeText={setPhone}
                    mode="outlined"
                    style={styles.input}
                    keyboardType="phone-pad"
                    left={<TextInput.Icon icon="phone" />}
                  />
                </>
              )}

              <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                left={<TextInput.Icon icon="email" />}
              />

              <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                mode="outlined"
                style={styles.input}
                secureTextEntry
                left={<TextInput.Icon icon="lock" />}
              />

              {isRegistering && (
                <TextInput
                  label="Department"
                  value={department}
                  onChangeText={setDepartment}
                  mode="outlined"
                  style={styles.input}
                  left={<TextInput.Icon icon="school" />}
                />
              )}

              <Button
                mode="contained"
                onPress={isRegistering ? handleRegister : handleLogin}
                style={styles.button}
                loading={loading}
                disabled={loading}
              >
                {isRegistering ? 'Register' : 'Login'}
              </Button>

              <Button
                mode="text"
                onPress={() => setIsRegistering(!isRegistering)}
                style={styles.switchButton}
              >
                {isRegistering
                  ? 'Already have an account? Login'
                  : "Don't have an account? Register"}
              </Button>
            </Card.Content>
          </Card>
        </ScrollView>

        <Portal>
          <Dialog visible={showRoleDialog} onDismiss={() => setShowRoleDialog(false)}>
            <Dialog.Title>Select Your Role</Dialog.Title>
            <Dialog.Content>
              <RadioButton.Group onValueChange={setRole} value={role}>
                <View style={styles.radioItem}>
                  <RadioButton value="student" />
                  <Text variant="bodyMedium">Student</Text>
                </View>
                <View style={styles.radioItem}>
                  <RadioButton value="faculty" />
                  <Text variant="bodyMedium">Faculty</Text>
                </View>
                <View style={styles.radioItem}>
                  <RadioButton value="admin" />
                  <Text variant="bodyMedium">Admin</Text>
                </View>
              </RadioButton.Group>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setShowRoleDialog(false)}>Cancel</Button>
              <Button onPress={confirmRegistration}>Confirm</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    backgroundColor: theme.colors.primary,
    marginBottom: 10,
  },
  logoText: {
    color: theme.colors.surface,
    fontWeight: 'bold',
  },
  title: {
    color: theme.colors.surface,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    color: theme.colors.surface,
    textAlign: 'center',
    opacity: 0.9,
  },
  card: {
    elevation: 8,
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
  },
  cardTitle: {
    textAlign: 'center',
    marginBottom: 20,
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    paddingVertical: 5,
  },
  switchButton: {
    marginTop: 15,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
});

export default LoginScreen;