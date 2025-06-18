export async function fetchListings({
    customerId,
    search = '',
    offset = 0,
    limit = 10,
  }: {
    customerId: string;
    search?: string;
    offset?: number;
    limit?: number;
  }) {
    const params = new URLSearchParams({
      customerId,
      search,
      offset: offset.toString(),
      limit: limit.toString(),
    });
  
    const res = await fetch(`http://localhost:5000/api/listings?${params}`);
    return res.json(); // { total, listings }
  }
  