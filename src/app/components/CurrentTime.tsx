import { useState, useEffect } from 'react';
import { format } from 'date-fns';

export function CurrentTime() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-sm text-black/60 dark:text-white/60 font-medium">
      {format(currentTime, 'h:mm:ss a')}
    </div>
  );
}
