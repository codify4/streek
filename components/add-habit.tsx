import { Modal, Text, TouchableOpacity, View } from "react-native";

// This component will be your modal content
const AddHabitModal = ({ visible, onClose }: { visible: boolean; onClose: () => void }) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-end">
                <View className="bg-white rounded-t-3xl p-6 h-screen">
                    <Text className="text-2xl font-sora-bold text-secondary mb-4">Add New Habit</Text>
                    {/* Add your form components here */}
                    <TouchableOpacity
                        onPress={onClose}
                        className="bg-primary py-3 rounded-full mt-4"
                    >
                        <Text className="text-white text-center font-sora-semibold">Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default AddHabitModal;