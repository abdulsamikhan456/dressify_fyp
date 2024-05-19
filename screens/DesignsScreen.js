import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, Modal, ActivityIndicator, Dimensions } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

const DesignsScreen = ({ route, navigation }) => {
    const { orderNumber, tailorEmail } = route.params;
    const [designs, setDesigns] = useState([]);
    const [showDescription, setShowDescription] = useState(false);
    const [selectedDesign, setSelectedDesign] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const screenWidth = Dimensions.get('window').width;

    useEffect(() => {
        const fetchData = async () => {
            const firestore = getFirestore();
            try {
                const usersCollectionRef = collection(firestore, "users");
                const q = query(usersCollectionRef, where("email", "==", tailorEmail));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const tailorDoc = querySnapshot.docs[0];
                    const customerRequestsRef = collection(tailorDoc.ref, "customerRequests");
                    const q2 = query(customerRequestsRef, where("orderNumber", "==", orderNumber));
                    const customerRequestsSnapshot = await getDocs(q2);

                    if (!customerRequestsSnapshot.empty) {
                        const orderDoc = customerRequestsSnapshot.docs[0];
                        const customerDesignsRef = collection(orderDoc.ref, "customerDesigns");
                        const customerDesignsSnapshot = await getDocs(customerDesignsRef);

                        if (!customerDesignsSnapshot.empty) {
                            const designsData = customerDesignsSnapshot.docs.map(doc => doc.data());
                            console.log("Fetched designs:", designsData);
                            setDesigns(designsData);
                        }
                    }
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, [orderNumber, tailorEmail]);

    const handleBackPress = () => {
        navigation.goBack();
    };

    const toggleDescription = (index) => {
        setSelectedDesign(index);
        setShowDescription(!showDescription);
    };

    const toggleFullScreenImage = (imageUri) => {
        setSelectedImage(imageUri);
        setShowDescription(false); // Close description box when opening full screen image
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity style={styles.leftArrowContainer} onPress={handleBackPress}>
                    <AntDesign name="leftcircleo" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Additional Designs</Text>
                <Text style={styles.header}>Designs Sent by Customer</Text>
                <Text style={styles.header1}>All the designs sent by the customer will be shown here.</Text>
            </View>
            <View style={styles.horizontalLine}></View>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" top={170}/>
            ) : designs.length === 0 ? (
                <Text style={styles.noDesignText}>There are no designs sent by the customer!</Text>
            ) : (
                <ScrollView>
                    <ScrollView contentContainerStyle={styles.designsContainer} horizontal={true}>
                        {designs.map((design, index) => (
                            <TouchableOpacity key={index} style={[styles.designItem, { width: (screenWidth - 30 * 4) / 3 }]} onPress={() => toggleFullScreenImage(design.selectedImages[0])}>
                                <Image source={{ uri: design.selectedImages[0] }} style={styles.designImage} />
                                <Text style={styles.descriptionButton} onPress={() => toggleDescription(index)}>Description</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </ScrollView>
            )}
            <Modal visible={showDescription} transparent={true} onRequestClose={() => setShowDescription(false)}>
                <View style={styles.modalContainer}>
                    <Text style={styles.descriptionText}>{designs[selectedDesign]?.description}</Text>
                </View>
            </Modal>
            <Modal visible={selectedImage !== null} transparent={true} onRequestClose={() => setSelectedImage(null)}>
                <View style={styles.modalContainer}>
                    <Image source={{ uri: selectedImage }} style={styles.fullScreenImage} />
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 30,
        bottom: 50,
    },
    header: {
        fontSize: 15,
        fontWeight: "bold",
        marginBottom: 10,
        right: 190,
        top: 45,
    },
    header1: {
        fontSize: 13,
        fontWeight: "400",
        marginBottom: 20,
        right: 375,
        top: 70,
    },
    headerText: {
        fontSize: 18,
        fontWeight: "bold",
        left: 70,
        bottom: 25,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        top: 50,
    },
    leftArrowContainer: {
        marginRight: 10,
        bottom: 25,
        right: 10,
    },
    horizontalLine: {
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        marginBottom: 20,
        top: 130,
    },
    designsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    designItem: {
        marginBottom: 20,
        marginRight: 10,
        position: 'relative',
    },
    designImage: {
        width: '100%',
        height: 100,
        resizeMode: 'cover',
        borderRadius: 10,
        top: 140
    },
    descriptionButton: {
        marginTop: 150,
        padding: 5,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        color: 'white',
        textAlign: 'center',
        width: '100%',
        borderRadius: 5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    descriptionText: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
        padding: 20,
    },
    fullScreenImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    noDesignText: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 50,
        top: 100
    },
});

export default DesignsScreen;
