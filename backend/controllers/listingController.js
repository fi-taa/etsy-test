import axios from "axios";
import Listing from "../models/Listing.js";

export const fetchAndStoreListings = async (req, res) => {
    const { customerId } = req.params;
    console.log(`📦 Fetching listings for customer: ${customerId}`);
  
    if (!customerId) return res.status(400).json({ error: "Missing customerId" });
  
    try {
      const { data } = await axios.get(`https://etsy-test.onrender.com/api/listings/${customerId}`);
      console.log(`🔍 Retrieved ${data.length} listings from Etsy API`);
  
      const newListings = [];
  
      for (const listing of data) {
        const exists = await Listing.findOne({ listingId: listing.listing_id });

        if (!exists) {
            const saved = await Listing.create({
                listingId: listing.listing_id,
                customerId,
                title: listing.title,
                description: listing.description,
                tags: listing.tags,
                image: listing.images?.[0]?.url_570xN ?? null,
                images: listing.images?.map((img) => img.url_570xN) ?? [],
              });
              
              
          newListings.push(saved);
          console.log(`✅ Inserted listingId: ${listing.listingId}`);
        } else {
            console.log(`⏭️ Skipped existing listingId: ${listing.listing_id}`);

        }
      }
  
      console.log(`📝 Total new listings inserted: ${newListings.length}`);
      res.json({ inserted: newListings.length });
    } catch (err) {
      console.error("❌ Failed to fetch or store listings:", err.message);
      res.status(500).json({ error: err.message });
    }
  };
  

export const getListings = async (req, res) => {
  const { customerId, search = "", offset = 0, limit = 10 } = req.query;

  if (!customerId) return res.status(400).json({ error: "Missing customerId" });

  const query = {
    customerId,
    $or: [
      { title: new RegExp(search, "i") },
      { description: new RegExp(search, "i") },
    ],
  };

  try {
    const total = await Listing.countDocuments(query);
    const listings = await Listing.find(query)
      .skip(Number(offset))
      .limit(Number(limit));

    res.json({ total, listings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
