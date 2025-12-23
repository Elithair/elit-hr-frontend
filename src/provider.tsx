import { Toaster } from "@/components/ui/sonner";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "@/routeTree.gen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./providers/theme-provider";
import { MockAuthProvider, useAuth } from "./providers/mock-auth-provider";

const router = createRouter({
	routeTree,
	context: {
		auth: undefined,
	},
});

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

function AuthRouterProvider() {
	const auth = useAuth();
	return <RouterProvider router={router} context={{ auth }} />;
}

const queryClient = new QueryClient();

export function Provider() {
	return (
		<ThemeProvider defaultTheme="system">
			<MockAuthProvider>
				<QueryClientProvider client={queryClient}>
					<Toaster />
					<AuthRouterProvider />
				</QueryClientProvider>
			</MockAuthProvider>
		</ThemeProvider>
	);
}
