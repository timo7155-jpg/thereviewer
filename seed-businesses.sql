-- =====================================================
-- SEED DATA: Run in Supabase SQL Editor
-- Safe: won't duplicate if slug already exists
-- Run this AFTER adding unique constraint on slug
-- =====================================================

-- Unique constraint on slug already exists (businesses_slug_key)
-- ON CONFLICT (slug) DO NOTHING will skip duplicates safely

-- =====================================================
-- HOTELS (25 top properties)
-- =====================================================

INSERT INTO businesses (name, slug, region, address, description, website, category, is_claimed) VALUES
('Royal Palm Beachcomber', 'royal-palm-beachcomber', 'North', 'Grand Baie', 'The crown jewel of Beachcomber hotels. An exclusive 5-star resort with 69 suites, Michelin-quality dining, and legendary service since 1985.', 'https://www.beachcomber-hotels.com/en/hotel/royal-palm', 'hotel', false),
('Canonnier Beachcomber Golf Resort & Spa', 'canonnier-beachcomber', 'North', 'Pointe aux Canonniers', 'Family-friendly 4-star resort set within historic ruins at a peninsula tip. Features two beaches, a treehouse spa, and lush tropical gardens.', 'https://www.beachcomber-hotels.com/en/hotel/canonnier', 'hotel', false),
('Paradise Cove Boutique Hotel', 'paradise-cove-boutique', 'North', 'Anse La Raie', 'Intimate adults-focused boutique hotel on a secluded cove. Known for its romantic atmosphere, private beach, and refined ocean-view gastronomy.', 'https://www.paradisecovehotel.com/', 'hotel', false),
('LUX Grand Gaube', 'lux-grand-gaube', 'North', 'Grand Gaube', 'Vibrant 5-star resort redesigned by Kelly Hoppen with bold contemporary style. Three beaches, LUX signature dining, and a serene spa.', 'https://www.luxresorts.com/en/mauritius/hotel/luxgrandgaube', 'hotel', false),
('Mauricia Beachcomber Resort & Spa', 'mauricia-beachcomber', 'North', 'Grand Baie', 'Lively 4-star beachfront resort in the heart of Grand Baie. Direct beach access, vibrant nightlife nearby, and water sports for all.', 'https://www.beachcomber-hotels.com/en/hotel/mauricia', 'hotel', false),
('Lagoon Attitude', 'lagoon-attitude', 'North', 'Anse La Raie', 'Adults-only 4-star hotel with an eco-friendly approach. Rooftop bar, local culinary experiences, and a relaxed barefoot-luxury vibe.', 'https://www.attitudehotels.com/lagoonattitude/', 'hotel', false),
('The Oberoi Beach Resort', 'oberoi-beach-resort', 'North', 'Turtle Bay', 'Award-winning 5-star resort featuring private villas with plunge pools. Renowned for tranquil atmosphere and exceptional cuisine.', 'https://www.oberoihotels.com/hotels-in-mauritius/', 'hotel', false),
('Radisson Blu Azuri Resort & Spa', 'radisson-blu-azuri', 'North', 'Haute Rive', 'Contemporary 5-star resort in the Azuri oceanfront village. Modern rooms, beachfront pool, and a walkable village with shops and restaurants.', 'https://www.radissonhotels.com/en-us/hotels/radisson-blu-resort-mauritius', 'hotel', false),
('One&Only Le Saint Geran', 'one-and-only-le-saint-geran', 'East', 'Belle Mare', 'Iconic 5-star resort on a private peninsula. Recently renovated with sleek suites, infinity pools, expansive spa, and six world-class restaurants.', 'https://www.oneandonlyresorts.com/le-saint-geran', 'hotel', false),
('Shangri-La Le Touessrok', 'shangri-la-le-touessrok', 'East', 'Trou d''Eau Douce', 'Prestigious 5-star resort with five white-sand beaches and a private island. Championship golf course, luxury spa, and exceptional dining.', 'https://www.shangri-la.com/mauritius/shangrila/', 'hotel', false),
('Constance Prince Maurice', 'constance-prince-maurice', 'East', 'Poste de Flacq', 'Ultra-luxury 5-star resort on 60 hectares of nature reserve. Famous for its floating restaurant and stilted suites over the lagoon.', 'https://www.constancehotels.com/en/hotels-resorts/mauritius/prince-maurice/', 'hotel', false),
('Constance Belle Mare Plage', 'constance-belle-mare-plage', 'East', 'Belle Mare', 'Grand 5-star resort spanning two kilometres of white sand. Two golf courses, seven restaurants, world-class spa, and family facilities.', 'https://www.constancehotels.com/en/hotels-resorts/mauritius/belle-mare-plage/', 'hotel', false),
('Long Beach Golf & Spa Resort', 'long-beach-golf-spa', 'East', 'Belle Mare', 'Contemporary 5-star resort with sleek architecture and vibrant atmosphere. Championship golf and one of the longest pools in the Indian Ocean.', 'https://www.sunresorts.com/long-beach', 'hotel', false),
('The Residence Mauritius', 'the-residence-mauritius', 'East', 'Belle Mare', 'Colonial-style 5-star resort exuding old-world elegance. Butler service, Sanctuary Spa by Codage, and plantation-inspired architecture.', 'https://www.cenizaro.com/theresidence/mauritius', 'hotel', false),
('Salt of Palmar', 'salt-of-palmar', 'East', 'Palmar', 'Trendy boutique hotel celebrating authentic Mauritian culture. Eco-conscious design, farm-to-table dining, and a community-first approach.', 'https://www.saltresorts.com/en/mauritius/hotel/saltofpalmar', 'hotel', false),
('The St. Regis Le Morne', 'st-regis-le-morne', 'West', 'Le Morne', 'Prestigious 5-star resort at the foot of UNESCO-listed Le Morne mountain. St. Regis Butler Service, manor house suites, and panoramic ocean views.', 'https://www.marriott.com/hotels/travel/mruxr-the-st-regis-mauritius-resort/', 'hotel', false),
('LUX Le Morne', 'lux-le-morne', 'West', 'Le Morne', 'Stylish 5-star resort between Le Morne mountain and turquoise lagoon. Popular with kite surfers, offering laid-back luxury and creative dining.', 'https://www.luxresorts.com/en/mauritius/hotel/luxlemorne', 'hotel', false),
('Paradis Beachcomber Golf Resort & Spa', 'paradis-beachcomber', 'West', 'Le Morne', 'Sprawling 5-star resort with its own 18-hole golf course. Beachfront villas, world-class spa, and access to the best kitesurfing spots.', 'https://www.beachcomber-hotels.com/en/hotel/paradis', 'hotel', false),
('Dinarobin Beachcomber Golf Resort & Spa', 'dinarobin-beachcomber', 'West', 'Le Morne', 'All-suite 5-star resort on Le Morne peninsula. Intimate atmosphere, lush gardens, award-winning spa, and adults-only sections.', 'https://www.beachcomber-hotels.com/en/hotel/dinarobin', 'hotel', false),
('JW Marriott Mauritius Resort', 'jw-marriott-mauritius', 'West', 'Le Morne', 'Modern 5-star luxury resort on the southwest coast. Spacious rooms, Manor Club lounge, spa, and curated culinary experiences.', 'https://www.marriott.com/hotels/travel/mrujw-jw-marriott-mauritius-resort/', 'hotel', false),
('Maradiva Villas Resort & Spa', 'maradiva-villas', 'West', 'Flic en Flac', 'Exclusive all-villa 5-star resort with private pools and gardens. Ayurvedic spa, fine dining, and one of the most private experiences in Mauritius.', 'https://www.maradiva.com/', 'hotel', false),
('Sands Suites Resort & Spa', 'sands-suites-resort', 'West', 'Flic en Flac', 'Boutique-style 4-star resort on Flic en Flac beach overlooking Tamarin Bay. Spacious suites, tranquil spa, and the best sunset views.', 'https://www.sandsresorts.com/', 'hotel', false),
('Shandrani Beachcomber Resort & Spa', 'shandrani-beachcomber', 'South', 'Blue Bay', '5-star all-inclusive resort on a private peninsula with three beaches. Overlooks Blue Bay Marine Park with water sports and family facilities.', 'https://www.beachcomber-hotels.com/en/hotel/shandrani', 'hotel', false),
('Heritage Le Telfair Golf & Wellness Resort', 'heritage-le-telfair', 'South', 'Bel Ombre', 'Refined 5-star resort inspired by colonial architecture. Set within Domaine de Bel Ombre with 18-hole golf, Seven Colours spa, and nature reserve.', 'https://www.heritageresorts.mu/en/le-telfair', 'hotel', false),
('Outrigger Mauritius Beach Resort', 'outrigger-mauritius', 'South', 'Bel Ombre', '5-star beachfront resort in the Bel Ombre estate. Spacious rooms, Navasana spa, and easy access to nature trails and Frederica reserve.', 'https://www.outrigger.com/mauritius', 'hotel', false)
ON CONFLICT (slug) DO NOTHING;


-- =====================================================
-- RESTAURANTS (20 top dining spots)
-- =====================================================

INSERT INTO businesses (name, slug, region, address, description, website, category, is_claimed) VALUES
('Le Pescatore', 'le-pescatore', 'North', 'Trou aux Biches', 'Fine dining institution on the northwest coast. Elegant seafood-focused cuisine with an ocean-view terrace, recognised as one of the best restaurants on the island.', 'https://www.lepescatore.mu/', 'restaurant', false),
('La Rougaille Creole', 'la-rougaille-creole', 'North', 'Grand Baie', 'Charming family restaurant in Grand Bay with colonial architecture. Elevates local Creole gastronomy with fresh seafood marinated in island spices.', NULL, 'restaurant', false),
('Chateau Mon Desir', 'chateau-mon-desir', 'North', 'Balaclava', 'Mauritius fine-dining classic set in a romantic colonial mansion overlooking the Ruins of Balaclava and Citron River. Exceptional French-Mauritian cuisine.', NULL, 'restaurant', false),
('Le Chamarel Restaurant', 'le-chamarel-restaurant', 'West', 'Chamarel', 'Set among treetops 250 metres above sea level. Showcases the best of Creole food and culture with panoramic views of the southwest coast.', 'https://www.lechamarelrestaurant.com/', 'restaurant', false),
('Le Chateau de Bel Ombre', 'chateau-bel-ombre', 'South', 'Bel Ombre', 'Fine dining within a 19th-century plantation house. Crystal chandeliers, antique wooden tables, and refined French-Mauritian gastronomy in a historic setting.', 'https://www.heritageresorts.mu/', 'restaurant', false),
('Amari by Vineet', 'amari-by-vineet', 'East', 'Belle Mare', 'Upscale restaurant by Michelin-starred chef Vineet Bhatia. Creative Indian cuisine with a contemporary twist in an elegant beachside setting.', NULL, 'restaurant', false),
('The Hungry Crocodile', 'the-hungry-crocodile', 'South', 'Riviere des Anguilles', 'Unique restaurant in La Vanille Nature Park. Offers exotic meats and Creole dishes in a lush tropical garden setting beside giant tortoises.', NULL, 'restaurant', false),
('Lambic', 'lambic', 'North', 'Grand Baie', 'Popular gastropub in Grand Baie known for its extensive craft beer selection and creative pub-style cuisine. Lively atmosphere and generous portions.', NULL, 'restaurant', false),
('Escale Creole', 'escale-creole', 'Central', 'Moka', 'Authentic Creole restaurant in a traditional Mauritian house. Home-cooked local dishes, warm hospitality, and a genuine cultural dining experience.', NULL, 'restaurant', false),
('Karay Mario', 'karay-mario', 'Central', 'Curepipe', 'A Mauritian institution serving the best of local cuisine. Famous for duck salmi, venison curry, and crab broth with fresh local ingredients.', NULL, 'restaurant', false),
('La Clef des Champs', 'la-clef-des-champs', 'South', 'Chamouny', 'Hidden gem in the south serving refined Franco-Mauritian cuisine. Set in a charming countryside house surrounded by sugar cane fields.', NULL, 'restaurant', false),
('Domaine Anna', 'domaine-anna', 'East', 'Flacq', 'A rustic countryside restaurant surrounded by fruit orchards. Authentic Mauritian home cooking served in a warm, family-run setting.', NULL, 'restaurant', false),
('Chez Tino', 'chez-tino', 'North', 'Trou aux Biches', 'Popular beachside Italian restaurant known for wood-fired pizzas and fresh seafood pasta. Casual atmosphere with toes-in-the-sand dining.', NULL, 'restaurant', false),
('Ocean Restaurant', 'ocean-restaurant', 'North', 'Grand Baie', 'Seafood-focused fine dining overlooking Grand Baie lagoon. Fresh daily catch prepared with French techniques and local Mauritian flavours.', NULL, 'restaurant', false),
('Eureka Table d''Hote', 'eureka-table-dhote', 'Central', 'Moka', 'Dining experience inside the historic Eureka colonial house, built in 1830. Traditional Creole table d''hote lunch served in period surroundings.', 'https://www.maisoneureka.com/', 'restaurant', false),
('Cafe des Arts', 'cafe-des-arts', 'West', 'Flic en Flac', 'Stylish cafe-restaurant with an artistic vibe in Flic en Flac. Serves contemporary cuisine, fresh juices, and homemade pastries in a relaxed creative space.', NULL, 'restaurant', false),
('Dallas Yesh Cuisine n Bar', 'dallas-yesh', 'West', 'Flic en Flac', 'Popular spot specialising in Mauritian snacks and fusion cuisine blending European and Asian influences. Flavourful and generously portioned.', NULL, 'restaurant', false),
('Ruisseau Creole', 'ruisseau-creole', 'West', 'Black River', 'Fine and imaginative cuisine on a beautiful Creole terrace overlooking the lagoon. Local ingredients elevated with contemporary techniques.', NULL, 'restaurant', false),
('Seg Mauritian Diner', 'seg-mauritian-diner', 'North', 'Grand Baie', 'Beloved local diner serving authentic Mauritian street food elevated to restaurant quality. Dholl puri, mine frit, and rougaille at their finest.', NULL, 'restaurant', false),
('Le Fangourin', 'le-fangourin', 'South', 'Bel Ombre', 'Restaurant set in a converted sugar mill within the Bel Ombre estate. Hearty Mauritian and international dishes in an atmospheric industrial-chic setting.', 'https://www.heritageresorts.mu/', 'restaurant', false)
ON CONFLICT (slug) DO NOTHING;


-- =====================================================
-- RETAIL & SHOPS (15 shopping destinations)
-- =====================================================

INSERT INTO businesses (name, slug, region, address, description, website, category, is_claimed) VALUES
('Bagatelle Mall of Mauritius', 'bagatelle-mall', 'Central', 'Moka', 'The island''s premier shopping destination with over 150 stores. International brands, local boutiques, cinema, food court, and regular cultural events.', 'https://www.bagatelle.mu/', 'retail', false),
('Caudan Waterfront', 'caudan-waterfront', 'Port Louis', 'Port Louis', 'Iconic waterfront complex with 170+ shops, art galleries, craft market, and entertainment venues. The heart of Port Louis shopping and culture.', 'https://www.caudan.com/', 'retail', false),
('Port Louis Central Market', 'port-louis-central-market', 'Port Louis', 'Port Louis', 'Historic daily market in the capital. Fresh produce, spices, street food, textiles, and handmade souvenirs across multiple bustling sections.', NULL, 'retail', false),
('Trianon Shopping Park', 'trianon-shopping-park', 'Central', 'Trianon', 'Modern shopping centre with fashion outlets, electronics, beauty shops, cinema, and family entertainment in a relaxed atmosphere.', NULL, 'retail', false),
('Phoenix Mall', 'phoenix-mall', 'Central', 'Phoenix', 'Bustling commercial centre with a mix of local shops, supermarkets, and international brands. A practical everyday shopping hub for locals.', NULL, 'retail', false),
('La Croisette', 'la-croisette', 'North', 'Grand Baie', 'Vibrant shopping and leisure complex in Grand Baie. Boutiques, restaurants, cinema, and bowling in a modern open-air waterfront setting.', 'https://lacroisette.mu/', 'retail', false),
('Flacq Market', 'flacq-market', 'East', 'Centre de Flacq', 'The largest open-air market in Mauritius, held every Wednesday and Sunday. Textiles, clothing, fresh produce, and local crafts at bargain prices.', NULL, 'retail', false),
('Craft Market Caudan', 'craft-market-caudan', 'Port Louis', 'Port Louis', 'Dedicated craft market within Caudan Waterfront. Model ships, wooden sculptures, handwoven baskets, and semiprecious stone jewellery by local artisans.', NULL, 'retail', false),
('Sunset Boulevard', 'sunset-boulevard-mall', 'North', 'Grand Baie', 'Shopping complex in Grand Baie featuring fashion stores, souvenir shops, and eateries. Popular with tourists for local brands and beachwear.', NULL, 'retail', false),
('Super U Grand Baie', 'super-u-grand-baie', 'North', 'Grand Baie', 'Large supermarket and commercial centre popular with residents and tourists. Fresh local produce, imported goods, and everyday essentials.', NULL, 'retail', false),
('Galerie des Iles', 'galerie-des-iles', 'West', 'Flic en Flac', 'Boutique shopping centre in Flic en Flac with local fashion, jewellery, and souvenir shops. Convenient stop for west coast visitors.', NULL, 'retail', false),
('Mahebourg Waterfront', 'mahebourg-waterfront', 'South', 'Mahebourg', 'Scenic waterfront area with small shops, cafes, and the famous Monday market. A charming glimpse into traditional Mauritian town life.', NULL, 'retail', false),
('Riche Terre Mall', 'riche-terre-mall', 'North', 'Riche Terre', 'Modern shopping centre with Jumbo supermarket, fashion retailers, food court, and family entertainment. Convenient for northern suburbs.', NULL, 'retail', false),
('So Flo', 'so-flo', 'West', 'Floreal', 'Outlet shopping destination in Floreal known for discounted branded clothing. Popular factory shops for knitwear and textiles made in Mauritius.', NULL, 'retail', false),
('Bo''Valon Mall', 'bovalon-mall', 'Central', 'Mahebourg', 'Shopping centre serving the south with supermarket, retail shops, banks, and dining options. A community hub for the Mahebourg area.', NULL, 'retail', false)
ON CONFLICT (slug) DO NOTHING;


-- =====================================================
-- SPAS & WELLNESS (10 standalone centres)
-- =====================================================

INSERT INTO businesses (name, slug, region, address, description, website, category, is_claimed) VALUES
('Foraha Spa', 'foraha-spa', 'West', 'Flic en Flac', 'Highly-rated couples spa with calming ambiance and professional therapists. 120-minute signature packages include tea, cake, and four hours of relaxation.', NULL, 'spa', false),
('Ayur Wellness', 'ayur-wellness', 'West', 'Flic en Flac', 'Authentic Ayurvedic wellness centre offering traditional Indian healing treatments, herbal massages, and holistic detox programmes.', NULL, 'spa', false),
('Footlove Reflexology', 'footlove-reflexology', 'North', 'Grand Baie', 'Specialised reflexology centre rated as one of the best healing and relaxation experiences on the island. Expert foot and body therapy.', NULL, 'spa', false),
('Ocean Harmony Spa', 'ocean-harmony-spa', 'North', 'Pereybere', 'Welcoming spa near Pereybere beach offering massages, facials, and body treatments. Professional therapists in a serene ocean-inspired setting.', NULL, 'spa', false),
('Luscious Spa and Beauty', 'luscious-spa-beauty', 'North', 'Trou aux Biches', 'Clean and inviting day spa in Trou aux Biches. Full range of beauty treatments, massages, and skincare services with welcoming staff.', NULL, 'spa', false),
('Hammam Spa Mauritius', 'hammam-spa-mauritius', 'Central', 'Quatre Bornes', 'Traditional hammam experience with modern amenities. Steam rooms, body scrubs, and relaxation pools inspired by Middle Eastern bathing culture.', NULL, 'spa', false),
('Maison de Sante Spa', 'maison-de-sante-spa', 'Central', 'Curepipe', 'Wellness centre specialising in therapeutic massages and physiotherapy. Professional treatments for stress relief, pain management, and rehabilitation.', NULL, 'spa', false),
('Zen Attitude Spa', 'zen-attitude-spa', 'East', 'Trou d''Eau Douce', 'Peaceful spa offering Balinese and Swedish massages, hot stone therapy, and aromatherapy. A tranquil escape on the east coast.', NULL, 'spa', false),
('Le Spa by Clarins', 'le-spa-clarins-flic', 'West', 'Flic en Flac', 'Premium day spa powered by Clarins skincare. Facials, body sculpting, and signature treatments using luxury French products.', NULL, 'spa', false),
('Thai Sabai Spa', 'thai-sabai-spa', 'North', 'Grand Baie', 'Authentic Thai massage and spa centre in Grand Baie. Traditional Thai techniques delivered by trained therapists in a calming bamboo setting.', NULL, 'spa', false)
ON CONFLICT (slug) DO NOTHING;


-- =====================================================
-- TOURS & ACTIVITIES (15 operators)
-- =====================================================

INSERT INTO businesses (name, slug, region, address, description, website, category, is_claimed) VALUES
('Catamaran Cruises Mauritius', 'catamaran-cruises-mu', 'West', 'Black River', 'Top-rated catamaran operator with 700+ glowing reviews. Private cruises, dolphin watching on the west coast, and overnight luxury catamaran experiences.', NULL, 'tour', false),
('Vitamin Sea Mauritius', 'vitamin-sea-mu', 'West', 'Black River', 'Speedboat and catamaran cruises featuring dolphin swimming at sunrise, island trips, sunset cruises, and underwater photography sessions.', 'https://www.vitaminsealtd.com/', 'tour', false),
('Dolphin Warrior', 'dolphin-warrior', 'West', 'La Gaulette', 'Number one rated tour company in La Gaulette. Ethical dolphin watching with max 15 passengers, whale encounters, and Benitiers Island lunch trips.', NULL, 'tour', false),
('Oceane Cruises', 'oceane-cruises', 'West', 'Black River', 'Premium catamaran cruises from Black River to Tamarin Bay. Dolphin encounters, snorkelling at Crystal Rock, and scenic trips to Ile aux Benitiers.', 'https://oceane.mu/', 'tour', false),
('Mauritius Guided Tours', 'mauritius-guided-tours', 'Central', 'Port Louis', 'Full-service tour operator offering island tours, cultural excursions, nature hikes, and customised private experiences across all regions.', 'https://mauritiusguidedtours.com/', 'tour', false),
('Yemaya Adventures', 'yemaya-adventures', 'East', 'Trou d''Eau Douce', 'Eco-adventure operator offering kayaking, stand-up paddleboarding, and guided snorkelling tours in the pristine waters of the east coast.', NULL, 'tour', false),
('Ile aux Cerfs Golf & Leisure', 'ile-aux-cerfs', 'East', 'Ile aux Cerfs', 'Iconic island destination offering water sports, beach activities, and an 18-hole Bernhard Langer golf course surrounded by turquoise lagoon.', NULL, 'tour', false),
('Casela World of Adventures', 'casela-world-adventures', 'West', 'Cascavelle', 'Major adventure park with zip-lining, canyoning, quad biking, and interaction with lions and other wildlife. Fun for families and thrill-seekers.', 'https://www.caselaworldofadventures.com/', 'tour', false),
('La Vallée des Couleurs', 'vallee-des-couleurs', 'South', 'Chamouny', 'Nature park featuring the famous 23-coloured earth, waterfalls, zip-lines, quad biking, and panoramic viewpoints across the southern landscape.', NULL, 'tour', false),
('Blue Safari Submarine', 'blue-safari-submarine', 'West', 'Trou aux Biches', 'Unique submarine experience diving 35 metres below the ocean surface. Explore coral reefs and shipwrecks through panoramic windows.', NULL, 'tour', false),
('Domaine de l''Etoile', 'domaine-etoile', 'East', 'Sebastopol', 'Eco-adventure estate offering quad biking, horse riding, zip-lining, and hiking through 1,200 hectares of pristine Mauritian nature reserve.', NULL, 'tour', false),
('Frederica Nature Reserve', 'frederica-nature-reserve', 'South', 'Bel Ombre', 'Guided nature experiences including 4x4 safaris, buggy tours, and hiking through ancient forest. Home to rare Mauritian wildlife and endemic plants.', NULL, 'tour', false),
('Ile des Deux Cocos', 'ile-des-deux-cocos', 'South', 'Blue Bay', 'Private island experience with snorkelling in the marine park, beachside lunch, and exploration of a charming colonial villa.', NULL, 'tour', false),
('Solar Sea Walk', 'solar-sea-walk', 'North', 'Grand Baie', 'Underwater walking experience on the ocean floor wearing a special helmet. See tropical fish and coral up close without any diving experience needed.', NULL, 'tour', false),
('Otayo Mauritius', 'otayo-mauritius', 'Central', 'Ebene', 'Leading online platform for booking activities, shows, and experiences across Mauritius. Wide selection from adventure to cultural tours.', 'https://www.otayo.com/', 'tour', false)
ON CONFLICT (slug) DO NOTHING;


-- =====================================================
-- CAR RENTAL (10 companies)
-- =====================================================

INSERT INTO businesses (name, slug, region, address, description, website, category, is_claimed) VALUES
('Pingouin Car Rental', 'pingouin-car-rental', 'Central', 'SSR Airport', 'Highly-rated rental company with a convenient airport kiosk. Wide vehicle range from economy to luxury, with reliable service and competitive prices.', 'https://carrental-mauritius.com/', 'car_rental', false),
('First Car Rental Mauritius', 'first-car-rental', 'Central', 'SSR Airport', 'Established rental agency with airport pickup desk. Clean, well-maintained vehicles, straightforward pricing, and professional customer service.', NULL, 'car_rental', false),
('Avis Mauritius', 'avis-mauritius', 'Central', 'SSR Airport', 'International car rental brand with multiple locations across Mauritius. Wide fleet from compact to premium vehicles with 24/7 roadside assistance.', 'https://www.avis.mu/', 'car_rental', false),
('Europcar Mauritius', 'europcar-mauritius', 'Central', 'SSR Airport', 'Global rental brand operating across the island. Airport and hotel delivery available, with comprehensive insurance options and modern fleet.', 'https://www.europcar.mu/', 'car_rental', false),
('Sixt Mauritius', 'sixt-mauritius', 'Central', 'SSR Airport', 'Premium car rental provider offering luxury and standard vehicles. Airport counter with efficient pickup process and flexible return options.', 'https://www.sixt.com/car-rental/mauritius/', 'car_rental', false),
('Hertz Mauritius', 'hertz-mauritius', 'Central', 'SSR Airport', 'Trusted international brand with reliable vehicles and island-wide coverage. Online booking, airport pickup, and hotel delivery available.', 'https://www.hertz.mu/', 'car_rental', false),
('ABC Car Rental', 'abc-car-rental', 'North', 'Grand Baie', 'Local favourite in the north offering affordable daily and weekly rentals. Personal service, free delivery to hotels, and well-maintained vehicles.', NULL, 'car_rental', false),
('Kreola Car Rental', 'kreola-car-rental', 'Central', 'Ebene', 'One of the largest local rental companies in Mauritius. Extensive fleet, competitive rates, and delivery service across the entire island.', NULL, 'car_rental', false),
('Maki Car Rental', 'maki-car-rental', 'West', 'Flic en Flac', 'Affordable car rental on the west coast. Small family-run business known for personal service, clean cars, and helpful local driving tips.', NULL, 'car_rental', false),
('FleetPro Services', 'fleetpro-services', 'Central', 'Port Louis', 'Leading fleet management and rental company in Mauritius. Corporate and long-term rental specialist with the largest vehicle fleet on the island.', NULL, 'car_rental', false)
ON CONFLICT (slug) DO NOTHING;
