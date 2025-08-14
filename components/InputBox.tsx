import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, StyleProp, ViewStyle, TextStyle, KeyboardTypeOptions } from 'react-native';

interface InputBoxProps {
  inputTitle?: string;
  inputSubText?: string;
  inputBoxStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  type?: 'normal' | 'password' | 'multiline' | 'date';
  value?: string;
  onChangeText?: (text: string) => void;
  errorMessage?: string;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  onFocus?: () => void; // New onFocus prop
}

export function InputBox({
  inputTitle,
  inputSubText,
  inputBoxStyle,
  inputStyle,
  type = 'normal',
  value,
  onChangeText,
  errorMessage,
  placeholder,
  keyboardType,
  onFocus, // Destructured onFocus prop
}: InputBoxProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [inputValue, setInputValue] = useState(value || '');

  const handleTextChange = (text: string) => {
    const maxLength = type === 'multiline' ? 100 : 40;
    let truncatedText = text;

    if (type === 'date') {
      // Remove non-numeric characters and limit to 8 digits (ddmmyyyy)
      let numericText = text.replace(/[^0-9]/g, '').slice(0, 8);
      let formattedText = '';
      
      // Format as dd/mm/yyyy
      for (let i = 0; i < numericText.length; i++) {
        if (i === 2 || i === 4) {
          formattedText += '/';
        }
        formattedText += numericText[i];
      }
      
      // Ensure complete format (e.g., prevent partial formats)
      if (numericText.length >= 8) {
        const day = parseInt(numericText.slice(0, 2));
        const month = parseInt(numericText.slice(2, 4));
        const year = parseInt(numericText.slice(4, 8));
        
        // Basic validation
        if (day > 31 || month > 12 || year < 1900 || year > new Date().getFullYear()) {
          return; // Don't update if invalid
        }
      }
      
      truncatedText = formattedText;
    } else {
      truncatedText = text.length > maxLength ? text.slice(0, maxLength) : text;
    }

    setInputValue(truncatedText);
    if (onChangeText) onChangeText(truncatedText);
  };

  return (
    <View style={styles.container}>
      {inputTitle && <Text style={styles.inputTitle}>{inputTitle}</Text>}
      {inputSubText && <Text style={styles.inputSubText}>{inputSubText}</Text>}
      <View style={[styles.inputBox, inputBoxStyle, type === 'multiline' && styles.multilineBox]}>
        <TextInput
          style={[styles.input, inputStyle, type === 'multiline' && styles.multilineInput]}
          secureTextEntry={type === 'password' && !showPassword}
          value={inputValue}
          onChangeText={handleTextChange}
          multiline={type === 'multiline'}
          textAlignVertical={type === 'multiline' ? 'top' : undefined}
          keyboardType={keyboardType || (type === 'date' ? 'numeric' : 'default')}
          placeholder={placeholder || (type === 'date' ? 'dd/mm/yyyy' : undefined)}
          placeholderTextColor="#999"
          onFocus={onFocus} // Attach onFocus to TextInput
        />
        {type === 'password' && (
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? 'eye-off' : 'eye'}
              size={24}
              color="#666"
            />
          </TouchableOpacity>
        )}
        {type === 'multiline' && (
          <Text style={styles.count}>
            {`${inputValue.length}/100`}
          </Text>
        )}
      </View>
      {errorMessage && (
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
          <Ionicons
            name="information-circle-outline"
            size={15}
            color="#ff0000"
          />
          <Text style={styles.error}>{errorMessage}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  inputTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputSubText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    position: 'relative',
    paddingHorizontal: 10,
  },
  multilineBox: {
    minHeight: 100,
    alignItems: 'flex-start',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  multilineInput: {
    textAlignVertical: 'top',
    paddingBottom: 10,
  },
  eyeIcon: {
    padding: 10,
  },
  count: {
    position: 'absolute',
    bottom: 5,
    right: 10,
    fontSize: 12,
    color: '#666',
  },
  error: {
    fontSize: 12,
    color: '#ff0000',
    marginLeft: 5,
  },
});