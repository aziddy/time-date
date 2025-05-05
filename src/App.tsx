import React, { Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";

// Use React.lazy for component loading
const CountDays = React.lazy(() => import("./components/CountDays"));
const TimezoneConverter = React.lazy(() => import("./components/TimezoneConverter"));
const AddDays = React.lazy(() => import("./components/AddDays"));

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">Time & Date Calculator</h1>

      <div className="w-full max-w-3xl bg-white rounded-lg shadow-md border border-zinc-200 p-4 md:p-6">
        <Tabs defaultValue="countDays" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="countDays">Count Days</TabsTrigger>
            <TabsTrigger value="timezoneConverter">Timezone Converter</TabsTrigger>
            <TabsTrigger value="addDays">Add/Subtract Days</TabsTrigger>
          </TabsList>

          <Suspense fallback={<div>Loading...</div>}>
            <TabsContent value="countDays">
              <CountDays />
            </TabsContent>

            <TabsContent value="timezoneConverter">
              <TimezoneConverter />
            </TabsContent>

            <TabsContent value="addDays">
              <AddDays />
            </TabsContent>
          </Suspense>
        </Tabs>
      </div>

      <footer className="mt-8 text-center text-sm text-gray-500">
        <p>Time & Date Calculator © {new Date().getFullYear()}</p>
      </footer>
    </div>
  )
}

export default App
