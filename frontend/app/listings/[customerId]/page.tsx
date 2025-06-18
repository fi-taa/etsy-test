import ListingBrowser from '@/components/ListingBrowser';

interface PageProps {
  params: Promise<{
    customerId: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { customerId } = await params;
  
  return (
    <main>
      <ListingBrowser customerId={customerId} />
    </main>
  );
}
