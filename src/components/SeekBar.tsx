import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

interface SeekBarProps {
  currentTime: number;
  duration: number;
  onSeek: (value: number) => void;
  theme: any;
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const SeekBar: React.FC<SeekBarProps> = ({ currentTime, duration, onSeek, theme }) => {
  const [sliderValue, setSliderValue] = useState(currentTime);
  const [isSeeking, setIsSeeking] = useState(false);

  useEffect(() => {
    if (!isSeeking) {
      setSliderValue(currentTime);
    }
  }, [currentTime, isSeeking]);

  const handleSeek = (value: number) => {
    setSliderValue(value);
    setIsSeeking(true);
  };

  const handleSeekEnd = (value: number) => {
    setSliderValue(value);
    setIsSeeking(false);
    console.log('🔍 Seeking to:', formatTime(value));
    onSeek(value);
  };

  return (
    <View style={styles.container}>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={duration || 1}
        value={sliderValue}
        onValueChange={handleSeek}
        onSlidingComplete={handleSeekEnd}
        minimumTrackTintColor="#FF8216"
        maximumTrackTintColor="#333333"
        thumbTintColor="#FF8216"
      />
      <View style={styles.timeContainer}>
        <Text style={[styles.timeText, { color: theme.text }]}>
          {formatTime(isSeeking ? sliderValue : currentTime)}
        </Text>
        <Text style={[styles.timeText, { color: '#888888' }]}>
          {formatTime(duration)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default SeekBar;
