declare global {
  interface Window {
    Telegram: {
      WebApp: {
        initData: string;
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
          };
          // Add other properties as needed
        };
        ready: () => void;
        expand: () => void;
        close: () => void;
        // Add more methods/properties based on Telegram Web App API docs
      };
    };
  }
}

export {};