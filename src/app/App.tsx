import { RouterProvider } from "react-router";
import { router } from "./routes";
import { MicrophonePermissionModal } from "./components/MicrophonePermissionModal";
import { ErrorBoundary } from "./components/ErrorBoundary";

export default function App() {
  return (
    <ErrorBoundary>
      <MicrophonePermissionModal />
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}