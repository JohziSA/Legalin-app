import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';

interface Option {
  label: string;
  value: string;
}

interface ComboBoxProps {
  comboTitle?: string;
  comboSubText?: string;
  comboBoxStyle?: StyleProp<ViewStyle>;
  comboStyle?: StyleProp<TextStyle>;
  value?: string;
  onChangeText?: (text: string) => void;
  onOpen?: () => void;
  onClose?: () => void;
  errorMessage?: string;
  options?: Option[];
  enableSearch?: boolean;
  width?: number | string;
  fontSize?: number;
  height?: number;
}

export function ComboBox({
  comboTitle,
  comboSubText,
  comboBoxStyle,
  comboStyle,
  value = '',
  onChangeText,
  onOpen,
  onClose,
  errorMessage,
  options = [],
  enableSearch = false,
  width = '100%',
  fontSize = 16,
  height = 40,
}: ComboBoxProps): React.ReactElement | null {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [searchText, setSearchText] = useState('');

  // Sync inputValue with value prop
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Filter options based on search
  const filteredOptions = enableSearch && searchText
    ? options.filter((option) =>
        option.label.toLowerCase().includes(searchText.toLowerCase())
      )
    : options;

  // Handle dropdown toggle
  const toggleDropdown = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    if (newIsOpen && onOpen) onOpen();
    else if (!newIsOpen && onClose) onClose();
  };

  // Handle option selection
  const handleSelect = (selectedValue: string) => {
    setInputValue(selectedValue);
    if (onChangeText) onChangeText(selectedValue);
    setIsOpen(false);
    setSearchText('');
    if (onClose) onClose();
  };

  const dynamicHeight = Math.min(50 + filteredOptions.length * (height * 1.2), 300);

  return (
    <View style={[styles.container, { width }]} accessible={true} accessibilityRole="combobox">
      {comboTitle && (
        <Text style={[styles.comboTitle, { fontSize }]} accessibilityRole="header">
          {comboTitle}
        </Text>
      )}
      {comboSubText && (
        <Text style={[styles.comboSubText, { fontSize: fontSize * 0.75 }]}>
          {comboSubText}
        </Text>
      )}
      <View style={[styles.comboBox, comboBoxStyle, { height }]}>
        <TouchableOpacity
          style={[styles.comboTrigger, { height }]}
          onPress={toggleDropdown}
          activeOpacity={0.8}
          accessible={true}
          accessibilityLabel="Toggle dropdown"
        >
          <TextInput
            style={[styles.input, comboStyle, { fontSize, height }]}
            value={inputValue || ''}
            editable={false}
            placeholder="Select an option"
            placeholderTextColor="#999"
            accessible={true}
            accessibilityLabel="Selected option"
          />
          <Ionicons
            name={isOpen ? 'chevron-up' : 'chevron-down'}
            size={fontSize * 1.5}
            color="#666"
            style={styles.chevronIcon}
          />
        </TouchableOpacity>
      </View>
      {isOpen && (
        <View style={[styles.dropdown, { width, maxHeight: dynamicHeight, top: height + 5 }]}>
          {enableSearch && options.length > 0 && (
            <TextInput
              style={[styles.searchInput, comboStyle, { fontSize, height }]}
              placeholder="Search"
              placeholderTextColor="#999"
              value={searchText}
              onChangeText={setSearchText}
              autoFocus={true}
              accessible={true}
              accessibilityLabel="Search options"
            />
          )}
          <ScrollView style={{ maxHeight: dynamicHeight - (enableSearch ? height : 0) }}>
            {filteredOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[styles.option, { height: height * 1.2 }]}
                onPress={() => handleSelect(option.value)}
                accessible={true}
                accessibilityLabel={`Select ${option.label}`}
              >
                <Text style={[styles.optionText, comboStyle, { fontSize }]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
      {errorMessage && (
        <View style={styles.errorContainer} accessible={true} accessibilityRole="alert">
          <Ionicons name="information-circle-outline" size={fontSize * 0.9375} color="#ff0000" />
          <Text style={[styles.error, { fontSize: fontSize * 0.75 }]}>
            {errorMessage}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  comboTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  comboSubText: {
    color: '#666',
    marginBottom: 10,
  },
  comboBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
  },
  comboTrigger: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    color: '#333',
  },
  chevronIcon: {
    position: 'absolute',
    right: 10,
  },
  dropdown: {
    position: 'absolute',
    left: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  searchInput: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    color: '#333',
  },
  option: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionText: {
    color: '#333',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  error: {
    color: '#ff0000',
    marginLeft: 5,
  },
});