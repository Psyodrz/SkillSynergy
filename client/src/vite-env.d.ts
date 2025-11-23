/// <reference types="vite/client" />

declare module '*.jsx' {
  import React from 'react';
  const Component: React.FC<any>;
  export default Component;
}

declare module '*.js' {
  const content: any;
  export default content;
}

// Explicit declarations matching the import paths exactly
declare module './pages/DashboardPage' {
  import React from 'react';
  const Component: React.FC<any>;
  export default Component;
}
declare module './pages/ProfilePage' {
  import React from 'react';
  const Component: React.FC<any>;
  export default Component;
}
declare module './pages/SettingsPage' {
  import React from 'react';
  const Component: React.FC<any>;
  export default Component;
}
declare module './pages/DiscoverPage' {
  import React from 'react';
  const Component: React.FC<any>;
  export default Component;
}
declare module './pages/ProjectsPage' {
  import React from 'react';
  const Component: React.FC<any>;
  export default Component;
}
declare module './pages/MessagesPage' {
  import React from 'react';
  const Component: React.FC<any>;
  export default Component;
}
declare module './components/Navbar' {
  import React from 'react';
  const Component: React.FC<any>;
  export default Component;
}
declare module './components/mobile/MobileBottomNav' {
  import React from 'react';
  const Component: React.FC<any>;
  export default Component;
}
declare module './hooks/useMediaQuery' {
  export const useIsDesktop: () => boolean;
  export const useIsMobile: () => boolean;
  const content: any;
  export default content;
}
