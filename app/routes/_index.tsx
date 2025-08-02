import type { MetaFunction } from '@remix-run/node';
import { Icon } from '@iconify/react';
import { Button } from '../components/ui/button';

export const meta: MetaFunction = () => {
  return [
    { title: 'Koyu Board - Engineer Community Forum' },
    {
      name: 'description',
      content:
        'A forum platform for engineers to share knowledge and collaborate.',
    },
  ];
};

export default function Index() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-16 p-8">
        <header className="flex flex-col items-center gap-9 text-center">
          <h1 className="text-4xl font-bold text-foreground">
            Welcome to Koyu Board
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            A community forum platform for engineers to share knowledge, discuss
            technical topics, and collaborate on projects.
          </p>
        </header>

        <div className="flex flex-col items-center gap-6">
          <Button size="lg" className="text-lg px-8 py-4">
            <Icon icon="lucide:arrow-right" className="ml-2 h-5 w-5" />
            Get Started
          </Button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="flex flex-col items-center text-center p-6 border rounded-lg">
              <Icon
                icon="lucide:users"
                className="h-12 w-12 text-primary mb-4"
              />
              <h3 className="text-lg font-semibold mb-2">Communities</h3>
              <p className="text-muted-foreground">
                Create and join technical communities
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 border rounded-lg">
              <Icon
                icon="lucide:message-square"
                className="h-12 w-12 text-primary mb-4"
              />
              <h3 className="text-lg font-semibold mb-2">Discussions</h3>
              <p className="text-muted-foreground">
                Threaded discussions with markdown support
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 border rounded-lg">
              <Icon icon="lucide:zap" className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Real-time Chat</h3>
              <p className="text-muted-foreground">
                Live chat for instant collaboration
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
