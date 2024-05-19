import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Pressable,
    Image,
  } from "react-native";
  import React from "react";
  
  const Services = () => {
    const services = [
      {
        id: "0",
        image: "https://cdn-icons-png.flaticon.com/128/2917/2917668.png",
        name: "Tailoring",
      },
      {
        id: "11",
        image: "https://cdn-icons-png.flaticon.com/128/4178/4178147.png",
        name: "Dry Cleaning",
      },
     
    ];
  
    return (
      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: "500", marginBottom: 7,padding: 10 }}>
          Services Available
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
          {services.map((service, index) => (
            <Pressable
              style={{
                margin: 10,
                backgroundColor: "white",
                padding: 20,
                borderRadius: 7,
                marginLeft: 45
             
              }}
              key={index}
            >
              <Image
                source={{ uri: service.image }}
                style={{ width: 70, height: 70 }}
              />
              <Text style={{ textAlign: "center", marginTop: 10 }}>
                {service.name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    );
  };
  
  export default Services;
  
  const styles = StyleSheet.create({});