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

interface MultiOptionComboProps {
  comboTitle?: string;
  comboSubText?: string;
  comboBoxStyle?: StyleProp<ViewStyle>;
  comboStyle?: StyleProp<TextStyle>;
  value?: string[];
  onChangeText?: (text: string[]) => void;
  onOpenChange?: (isOpen: boolean) => void;
  errorMessage?: string;
  options?: Option[];
  enableSearch?: boolean;
  width?: number | string;
  fontSize?: number;
  height?: number;
}

/**
 * A customizable multi-select combobox component with dropdown and optional search.
 */
export function MultiOptionCombo({
  comboTitle,
  comboSubText,
  comboBoxStyle,
  comboStyle,
  value = [],
  onChangeText,
  onOpenChange,
  errorMessage,
  options = [],
  enableSearch = false,
  width = '100%',
  fontSize = 16,
  height = 40,
}: MultiOptionComboProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);

  // Handle dropdown toggle
  const toggleDropdown = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    onOpenChange?.(newIsOpen);
  };

  // Handle option selection or deselection
  const handleSelect = (selectedValue: string) => {
    const newValue = value.includes(selectedValue)
      ? value.filter((item) => item !== selectedValue)
      : [...value, selectedValue];
    onChangeText?.(newValue);
  };

  // Remove a selected option
  const removeSelection = (selectedValue: string) => {
    const newValue = value.filter((item) => item !== selectedValue);
    onChangeText?.(newValue);
  };

  // Filter options based on search
  useEffect(() => {
    setFilteredOptions(
      enableSearch
        ? options.filter((option) =>
            option.label.toLowerCase().includes(searchText.toLowerCase())
          )
        : options
    );
  }, [options, searchText, enableSearch]);

  const dynamicHeight = Math.min(50 + filteredOptions.length * 50, 300);

  return (
    <View style={[styles.container, { width }]}>
      {comboTitle && (
        <Text style={[styles.comboTitle, { fontSize }]}>{comboTitle}</Text>
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
          activeOpacity={1}
        >
          <TextInput
            style={[styles.input, comboStyle, { fontSize, height }]}
            value={value.length > 0 ? `${value.length} item(s) selected` : 'Select options'}
            editable={false}
            placeholder="Select options"
            placeholderTextColor="#999"
          />
          <Ionicons
            name={isOpen ? 'chevron-up' : 'chevron-down'}
            size={fontSize * 1.5}
            color="#666"
            style={styles.chevronIcon}
          />
        </TouchableOpacity>
      </View>
      {value.length > 0 && (
        <ScrollView
          horizontal
          style={styles.selectedOptions}
          showsHorizontalScrollIndicator={false}
        >
          {value.map((selectedValue) => {
            const option = options.find((opt) => opt.value === selectedValue);
            return (
              <View key={selectedValue} style={styles.selectedItem}>
                <Text style={[styles.selectedText, { fontSize }]}>
                  {option?.label || selectedValue}
                </Text>
                <TouchableOpacity onPress={() => removeSelection(selectedValue)}>
                  <Ionicons name="close-circle" size={fontSize * 0.9375} color="#ff0000" />
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
      )}
      {isOpen && (
        <View style={[styles.dropdown, { width, maxHeight: dynamicHeight }]}>
          {enableSearch && options.length > 0 && (
            <TextInput
              style={[styles.searchInput, comboStyle, { fontSize, height }]}
              placeholder="Search"
              placeholderTextColor="#999"
              value={searchText}
              onChangeText={setSearchText}
            />
          )}
          <ScrollView>
            {filteredOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.option,
                  { height: height * 1.2 },
                  value.includes(option.value) && styles.selectedOption,
                ]}
                onPress={() => handleSelect(option.value)}
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
        <View style={styles.errorContainer}>
          <Ionicons
            name="information-circle-outline"
            size={fontSize * 0.9375}
            color="#ff0000"
          />
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
    top: '100%',
    left: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    zIndex: 1000,
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
  selectedOption: {
    backgroundColor: '#e0e0e0',
  },
  optionText: {
    color: '#333',
  },
  selectedOptions: {
    flexDirection: 'row',
    marginTop: 5,
    paddingVertical: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  selectedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 5,
    marginHorizontal: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedText: {
    color: '#333',
    marginRight: 5,
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