import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <NavigationContainer>
      <AppNavigator
        isAuthenticated={isAuthenticated}
        onLogin={() => setIsAuthenticated(true)}
      />
    </NavigationContainer>
  );
}
