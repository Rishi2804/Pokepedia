import React, { createRef, forwardRef, useEffect, useRef, useState } from "react";
import { StyleSheet, View, Text, Pressable, Animated } from "react-native";

const Indicator = ({ measures, tab }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: measures[tab].x,
      useNativeDriver: false
    }).start();
  }, [tab, measures, animatedValue]);

  return (
    <Animated.View
      style={[
        styles.indicator,
        {
          width: measures[tab].width,
          left: animatedValue
        }
      ]}
    />
  );
};

const Tab = forwardRef(({ text, isSelected }, ref) => {
  return (
    <View style={[styles.tab]} ref={ref}>
      <Text style={{ opacity: isSelected ? 1 : 0.8, color: "white", fontWeight: "700" }}>{text}</Text>
    </View>
  );
});

const Tabs = ({ tabText, tab, setTab }) => {
  const [measures, setMeasures] = useState([]);
  const containerRef = useRef();
  const data = tabText.map((title, index) => ({
    key: index,
    title: title,
    ref: createRef()
  }));

  useEffect(() => {
    let m = [];
    data.forEach(item => {
      item.ref.current.measureLayout(
        containerRef.current,
        (x, y, width, height) => {
          m.push({ x, y, width, height });

          if (m.length === data.length) {
            setMeasures(m);
          }
        }
      );
    });
  }, [data]);

  return (
    <View style={styles.containter} ref={containerRef}>
      {data.map((data, index) => {
        return (
          <Pressable onPress={() => setTab(index)} style={{ flex: 1 }} key={index}>
            <Tab text={data.title} isSelected={tab === index} ref={data.ref} />
          </Pressable>
        );
      })}
      {measures.length > 0 && <Indicator measures={measures} tab={tab} />}
    </View>
  );
};

const styles = StyleSheet.create({
  containter: {
    height: 50,
    flexDirection: "row"
  },
  tab: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1
  },
  indicator: {
    position: "absolute",
    height: 4,
    backgroundColor: "white",
    bottom: 0
  }
});

export default Tabs;
