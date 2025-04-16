// app/(chamatabs)/[chamaId]/_layout.jsx
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { ChamaProvider } from "../../context/ChamaContext"; // Import the context provider
import TabLayout from "../../_TabLayout"; // Import the TabLayout component

export default function Layout() {
  const { chamaId } = useLocalSearchParams(); // Get the chamaId from the URL

  if (!chamaId) {
    return <Text>No chama selected</Text>;
  }

  return (
    <ChamaProvider chamaId={chamaId}>
      {" "}
      {/* Wrap everything in ChamaProvider */}
      <TabLayout />
    </ChamaProvider>
  );
}
