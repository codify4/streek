import React from "react";
import { forwardRef } from "react"
import { StyleSheet } from "react-native"
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

const BotSheet = forwardRef(({ children, snapPoints }: { children: React.ReactNode, snapPoints: string[] }, ref: any) => {
    return (
        <>  
            <BottomSheet 
                ref={ref} 
                snapPoints={snapPoints} 
                index={-1} 
                enablePanDownToClose
                handleStyle={{ backgroundColor: "#ffffff", borderTopLeftRadius: 40, borderTopRightRadius: 50, }} 
                handleIndicatorStyle={{ backgroundColor: "#1B1B3A" }} 
                backgroundStyle={{
                    backgroundColor: "#ffffff", 
                    borderTopLeftRadius: 40, 
                    borderTopRightRadius: 40,
                }}
                containerStyle={{display: "flex", flex: 1, alignItems: "center", justifyContent: "center"}}  
            >
                <BottomSheetView style={styles.contentContainer}>
                    {children}
                </BottomSheetView>
            </BottomSheet>
        </>
    )
})

const styles = StyleSheet.create({
    contentContainer: {
      flex: 1,
      padding: 20,
      alignItems: "center",
      backgroundColor: "#ffffff",
    },
});

export default BotSheet