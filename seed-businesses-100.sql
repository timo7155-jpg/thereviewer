-- =====================================================
-- SEED DATA: 100 additional real Mauritius businesses
-- Run in Supabase SQL Editor
-- Safe: ON CONFLICT (slug) DO NOTHING skips duplicates
-- =====================================================


-- =====================================================
-- HOTELS (15 — boutique, 3-4 star, guesthouses)
-- =====================================================

INSERT INTO businesses (name, slug, region, address, description, website, category, is_claimed) VALUES
('Hennessy Park Hotel', 'hennessy-park-hotel', 'Central', 'Ebene', 'Contemporary 4-star business hotel in Ebene Cybercity with modern rooms, rooftop bar, and excellent dining. Popular with both business travellers and tourists exploring the island.', 'https://www.hennessyparkhotel.com/', 'hotel', false),
('The Ravenala Attitude', 'ravenala-attitude', 'North', 'Balaclava', 'All-suite 4-star hotel set in an exotic garden between the Indian Ocean and the Citron River. Nine restaurants, a spa, and a vibrant family-friendly atmosphere on the northwest coast.', 'https://hotels-attitude.com/en/the-ravenala-attitude', 'hotel', false),
('Zilwa Attitude', 'zilwa-attitude', 'North', 'Calodyne', 'A 100% Mauritian concept hotel near the fishing village of Grand Gaube. Authentic local experiences, views of five northern islands, and a charming laid-back atmosphere.', 'https://hotels-attitude.com/en/zilwa-attitude', 'hotel', false),
('Veranda Pointe aux Biches', 'veranda-pointe-aux-biches', 'North', 'Pointe aux Piments', 'Barefoot-chic 4-star boutique hotel on the northwest coast. Adults-only Sandy Lane Wing, two pools, and the Seven Colours Wellness Lounge overlooking the lagoon.', 'https://veranda-resorts.com/en/mauritius-hotel-veranda-pointe-aux-biches', 'hotel', false),
('Coin de Mire Attitude', 'coin-de-mire-attitude', 'North', 'Cap Malheureux', 'Quiet and laid-back 3-star hotel in northern Mauritius about 10 minutes from Grand Baie. An ideal starting point to discover the island and its inhabitants.', 'https://hotels-attitude.com/en/coin-de-mire-attitude', 'hotel', false),
('Friday Attitude', 'friday-attitude', 'East', 'Trou d''Eau Douce', 'Boutique 3-star hotel offering an authentic Mauritian experience with dinner in local homes, market visits, and cooking classes. Steps from the Ile aux Cerfs boat departure.', 'https://hotels-attitude.com/en/friday-attitude', 'hotel', false),
('Tropical Attitude', 'tropical-attitude', 'East', 'Trou d''Eau Douce', 'Charming 3-star hotel combining elegance and authenticity on the east coast. Direct boat access to Ile aux Cerfs and warm Mauritian hospitality throughout.', 'https://hotels-attitude.com/en/tropical-attitude', 'hotel', false),
('Mystik Lifestyle Hotel', 'mystik-lifestyle-hotel', 'North', 'Mont Choisy', 'Boutique hotel with 33 contemporary rooms on the northwest shore. Reflects local craftsmanship and design, with a pool, restaurant, and easy beach access.', NULL, 'hotel', false),
('Seapoint Boutique Hotel', 'seapoint-boutique-hotel', 'North', 'Pointe aux Canonniers', 'Adults-only boutique hotel in an elegant tropical style with white-washed walls and thatched palm roofs. A quiet beach retreat between Grand Baie and Mont Choisy.', 'https://www.searesortshotels.com/seapoint/', 'hotel', false),
('Aanari Hotel & Spa', 'aanari-hotel-spa', 'West', 'Flic en Flac', 'Creole-inspired 3-star hotel just 60 metres from Flic en Flac Beach. Features a two-tiered pool, Amrita Spa, and on-site dining at affordable rates.', 'https://www.aanari.com/', 'hotel', false),
('Veranda Tamarin Hotel & Spa', 'veranda-tamarin', 'West', 'Tamarin', '3-star hotel with direct beach access in Tamarin Bay. Popular with surfers and nature lovers, offering snorkelling, kayaking, and dolphin-watching nearby.', 'https://veranda-resorts.com/en/mauritius-hotel-veranda-tamarin', 'hotel', false),
('Recif Attitude', 'recif-attitude', 'North', 'Pointe aux Piments', 'Adults-only 3-star retreat on the northwest coast with a private beach and beachfront dining. A relaxed, intimate option for couples seeking tranquillity.', 'https://hotels-attitude.com/en/recif-attitude', 'hotel', false),
('Le Palmiste Resort & Spa', 'le-palmiste-resort', 'North', 'Trou aux Biches', '4-star resort in the heart of Trou aux Biches with tropical gardens, a spa, pool, and direct access to one of the best beaches on the island.', NULL, 'hotel', false),
('Le Jadis Hotel & Spa', 'le-jadis-hotel', 'North', 'Balaclava', 'Boutique 5-star resort in Balaclava with an award-winning spa featuring hydrotherapy and thermotherapy facilities. Intimate and stylish retreat on the northwest coast.', 'https://www.lejadis.com/', 'hotel', false),
('Seastar Hotel', 'seastar-hotel-flic', 'West', 'Flic en Flac', 'Budget-friendly 3-star hotel in Flic en Flac with an outdoor pool, garden, and free parking. A practical base for exploring the west coast beaches and attractions.', NULL, 'hotel', false)
ON CONFLICT (slug) DO NOTHING;


-- =====================================================
-- RESTAURANTS (20 — local, Chinese, Indian, seafood, cafes)
-- =====================================================

INSERT INTO businesses (name, slug, region, address, description, website, category, is_claimed) VALUES
('Le Capitaine', 'le-capitaine-grand-baie', 'North', 'Grand Baie', 'One of the oldest seafood restaurants in Grand Baie, serving innovative local cuisine since 1989. Fresh fish and lobster with panoramic ocean views.', 'https://www.lecapitaine.mu/', 'restaurant', false),
('Chez Meung', 'chez-meung', 'North', 'Grand Baie', 'Cozy Chinese restaurant on La Colline Road known for outstanding mine bouille and curries. Garden setting with bonsai trees and friendly beach-side service.', NULL, 'restaurant', false),
('Chinese Garden', 'chinese-garden-grand-baie', 'North', 'Grand Baie', 'Beloved for fresh seafood from lobster and crab to Peking red snapper. Classic Chinese dishes like Peking duck and stir-fried noodles with relaxed terrace seating.', NULL, 'restaurant', false),
('Wapalapam', 'wapalapam-le-morne', 'West', 'Le Morne', 'Charming beach restaurant in the foothills of Le Morne Brabant. Homemade dishes blending Indian Ocean, African, and Asian influences in a feet-in-the-water setting.', NULL, 'restaurant', false),
('La Bonne Chute', 'la-bonne-chute', 'West', 'Tamarin', 'The oldest restaurant on the west coast, opened in 1969. Specialises in game meat and seafood with live bands, guest DJs, and a vibrant courtyard atmosphere.', 'https://labonnechuterestaurantandbar.com/', 'restaurant', false),
('Namaste Restaurant', 'namaste-restaurant', 'Port Louis', 'Port Louis', 'Sophisticated Indian restaurant at Le Caudan Waterfront with Mughlai cuisine and Tandoor-grilled specialities. Chefs from Delhi and ocean-view dining.', 'https://namaste.restaurant.mu/', 'restaurant', false),
('Tandoori Express', 'tandoori-express-caudan', 'Port Louis', 'Port Louis', 'Authentic North and South Indian cuisine at Le Caudan Waterfront. Affordable tandoori dishes, biryanis, and curries in a casual setting.', NULL, 'restaurant', false),
('Le Courtyard', 'le-courtyard-port-louis', 'Port Louis', 'Port Louis', 'Open-air fine dining in Port Louis serving refined French-Mauritian dishes. Known for foie gras, scallop carpaccio, and elegant presentation.', NULL, 'restaurant', false),
('Chez Rosy', 'chez-rosy', 'South', 'Mahebourg', 'Rustic Creole restaurant with colourful decor in Mahebourg. Langoustes with garlic parsley butter and vindaye d''ourite are house specialities.', NULL, 'restaurant', false),
('Deer Hunter', 'deer-hunter-restaurant', 'South', 'Bel Ombre', 'Lively celebration of traditional Mauritian cuisine at Domaine de Bel Ombre. Chef Rajesh Payanandee transforms Creole classics into refined dishes with bold flavours.', NULL, 'restaurant', false),
('Le Barachois', 'le-barachois', 'East', 'Belle Mare', 'Iconic floating restaurant surrounded by mangroves at Constance Prince Maurice. Diners eat on wooden decks while freshly caught seafood is prepared in a thatched cottage.', NULL, 'restaurant', false),
('Le Capitaine Seafood', 'le-capitaine-seafood-gb', 'North', 'Grand Baie', 'Fine seafood dining institution in Grand Baie with unbeatable ocean views. Over three decades of serving the freshest catches with creative local preparations.', 'https://www.lecapitaine.restaurant/', 'restaurant', false),
('Coteau du Lac', 'coteau-du-lac', 'Central', 'Curepipe', 'Well-established restaurant in Curepipe known for refined Mauritian and French cuisine. A favourite among locals for special occasions and Sunday lunches.', NULL, 'restaurant', false),
('Chateau Labourdonnais Restaurant', 'chateau-labourdonnais-restaurant', 'North', 'Mapou', 'Dining within a beautifully restored 19th-century colonial estate. Seasonal menu using estate-grown produce alongside rum tastings and garden tours.', 'https://www.chateaulabourdonnais.com/', 'restaurant', false),
('L''Alchimiste', 'lalchimiste-grand-baie', 'North', 'Grand Baie', 'Popular restaurant and bar in Grand Baie serving creative cocktails and contemporary cuisine. Known for its lively atmosphere and weekend brunches.', NULL, 'restaurant', false),
('Cafe du Vieux Conseil', 'cafe-du-vieux-conseil', 'Port Louis', 'Port Louis', 'Charming cafe set in a historic building near Government House. Serves Mauritian pastries, fresh juices, and light lunches in a colonial courtyard setting.', NULL, 'restaurant', false),
('Happy Rajah', 'happy-rajah', 'North', 'Grand Baie', 'Vibrant Indian restaurant in Grand Baie offering tandoori, curry, and biryani dishes in generous portions. Popular with locals and tourists alike for authentic flavours.', NULL, 'restaurant', false),
('Sakura Japanese Restaurant', 'sakura-japanese', 'Central', 'Ebene', 'Japanese restaurant in Ebene offering sushi, sashimi, teppanyaki, and ramen. A taste of Japan with fresh ingredients and skilled preparation.', NULL, 'restaurant', false),
('L''Aventure du Sucre Restaurant', 'laventure-du-sucre-restaurant', 'North', 'Pamplemousses', 'Restaurant within the famous sugar museum at Pamplemousses. Creole buffet lunch in a historic sugar mill setting with educational exhibits nearby.', 'https://www.aventuredusucre.com/', 'restaurant', false),
('Andrea Italian Restaurant', 'andrea-italian', 'West', 'Flic en Flac', 'Family-run Italian restaurant in Flic en Flac with handmade pasta, wood-fired pizzas, and imported Italian wines. A west coast favourite for casual evenings.', NULL, 'restaurant', false)
ON CONFLICT (slug) DO NOTHING;


-- =====================================================
-- RETAIL & SHOPS (15 — markets, specialty, duty-free, craft)
-- =====================================================

INSERT INTO businesses (name, slug, region, address, description, website, category, is_claimed) VALUES
('Go Duty Free Grand Baie', 'go-duty-free-grand-baie', 'North', 'Grand Baie', 'Premium duty-free shop offering international brands and the Authentic Mauritius label supporting local artisans. Curated selection of spirits, cosmetics, and gifts.', 'https://www.godutyfree.mu/', 'retail', false),
('Go Duty Free Caudan', 'go-duty-free-caudan', 'Port Louis', 'Port Louis', 'Duty-free shopping at Caudan Waterfront with quality international and local products. Strict quality curation and authentic Mauritian handicrafts.', 'https://www.godutyfree.mu/', 'retail', false),
('Adamas Diamond Showroom', 'adamas-diamonds', 'Central', 'Floreal', 'The largest jewellery retailer in Mauritius since 1987. Diamond showroom in Floreal with outlets at Caudan Waterfront, Grand Baie, and Cascavelle.', 'https://www.taxfreeshopping.mu/en/shopping/shops/adamas', 'retail', false),
('Ravior Jewellery', 'ravior-jewellery', 'Port Louis', 'Port Louis', 'Award-winning jewellery shop specialising in handmade pieces and custom designs. Shops at Newton Tower, Ruisseau Creole, and the airport.', NULL, 'retail', false),
('Coeur de Ville Grand Bay', 'coeur-de-ville-grand-bay', 'North', 'Grand Baie', 'Shopping centre in the heart of Grand Baie with boutiques, restaurants, and services. A convenient stop for everyday shopping and tourist souvenirs.', NULL, 'retail', false),
('Cascavelle Shopping Mall', 'cascavelle-shopping-mall', 'West', 'Cascavelle', 'Modern shopping centre on the west coast featuring fashion, electronics, dining, and entertainment. Convenient for Flic en Flac and Tamarin visitors.', NULL, 'retail', false),
('Grand Baie Bazaar', 'grand-baie-bazaar', 'North', 'Grand Baie', 'Open-air market and craft bazaar in Grand Baie selling textiles, souvenirs, local crafts, and clothing. A bustling spot for bargain hunting and authentic gifts.', NULL, 'retail', false),
('Quatre Bornes Market', 'quatre-bornes-market', 'Central', 'Quatre Bornes', 'Popular Thursday and Sunday fair known as the Foire de Quatre Bornes. Clothing, textiles, street food, and household goods at bargain prices.', NULL, 'retail', false),
('Goodlands Market', 'goodlands-market', 'North', 'Goodlands', 'Lively Tuesday and Friday market in the northern town of Goodlands. Fresh produce, spices, textiles, and local street food at wholesale prices.', NULL, 'retail', false),
('Victoria Urban Terminal', 'victoria-urban-terminal', 'Port Louis', 'Port Louis', 'Bustling commercial hub adjacent to Port Louis bus station. Market stalls, small shops, street food vendors, and daily essentials in a vibrant atmosphere.', NULL, 'retail', false),
('Le Craft Market Flic en Flac', 'craft-market-flic-en-flac', 'West', 'Flic en Flac', 'Beachside craft market offering handmade model ships, dodo souvenirs, woven baskets, vanilla, and local spices. A popular stop for west coast tourists.', NULL, 'retail', false),
('Floreal Square', 'floreal-square', 'Central', 'Floreal', 'Shopping centre in the highlands with factory outlet stores for locally made knitwear and textiles. Popular with bargain hunters looking for quality Mauritian garments.', NULL, 'retail', false),
('Tamarin Shopping Centre', 'tamarin-shopping-centre', 'West', 'Tamarin', 'Neighbourhood shopping centre serving the Tamarin area with supermarket, pharmacy, boutiques, and cafes. A practical hub on the west coast.', NULL, 'retail', false),
('Rose Hill Market', 'rose-hill-market', 'Central', 'Rose Hill', 'Daily market in the centre of Rose Hill offering fresh produce, flowers, spices, and household goods. One of the most authentic local market experiences.', NULL, 'retail', false),
('Mahebourg Monday Market', 'mahebourg-monday-market', 'South', 'Mahebourg', 'Colourful Monday market on the Mahebourg waterfront. Fresh seafood, tropical fruits, textiles, and local crafts in a charming southern town setting.', NULL, 'retail', false)
ON CONFLICT (slug) DO NOTHING;


-- =====================================================
-- SPAS & WELLNESS (10 — day spas, yoga, wellness)
-- =====================================================

INSERT INTO businesses (name, slug, region, address, description, website, category, is_claimed) VALUES
('Cinq Mondes Spa Flic en Flac', 'cinq-mondes-spa-flic', 'West', 'Flic en Flac', 'Award-winning spa brand offering Beauty Rituals of the World. Facials, massages, tropical baths, and hammam treatments using natural ingredients.', 'https://www.cinqmondes.com/', 'spa', false),
('Shanti Maurice Nira Spa', 'shanti-maurice-nira-spa', 'South', 'St Felix', 'World-class Ayurvedic spa at Shanti Maurice resort offering holistic programmes, yoga, and traditional Indian healing treatments in a serene beachfront setting.', 'https://shantimaurice.com/spa-wellbeing/', 'spa', false),
('MGC Wellness Centre', 'mgc-wellness-centre', 'Central', 'Vacoas', 'Fitness and wellness centre offering yoga, Muay Thai, Zumba, Pilates, spinning, HIIT, aqua gym, and table tennis classes for all levels.', 'https://www.mgc.mu/', 'spa', false),
('The Pilates & Yoga Studio Tamarin', 'pilates-yoga-studio-tamarin', 'West', 'Tamarin', 'Pioneer of the Pilates method in Mauritius, run by Ingrid Rey. Offers classical Pilates and yoga classes in a dedicated studio setting.', NULL, 'spa', false),
('Ignite Studios', 'ignite-studios', 'Central', 'Quatre Bornes', 'Pilates sanctuary in Quatre Bornes catering to all levels. Experienced instructors providing personalised sessions in a supportive, welcoming environment.', NULL, 'spa', false),
('Natural Massage Centre', 'natural-massage-centre', 'North', 'Grand Baie', 'Salon and massage centre in Grand Baie offering traditional spa packages, aromatherapy, and relaxation treatments. Affordable wellness for visitors and locals.', NULL, 'spa', false),
('Domaine de Grand Baie Spa by Sothys', 'domaine-grand-baie-spa', 'North', 'Grand Baie', 'Day spa within the Domaine de Grand Baie residence using premium Sothys skincare products. Facials, body treatments, and massage in an elegant setting.', 'https://domainegrandbaie.com/', 'spa', false),
('Seven Colours Wellness Lounge', 'seven-colours-wellness', 'South', 'Bel Ombre', 'Signature spa of Heritage Resorts offering holistic Mauritian-inspired treatments. Colour therapy, herbal wraps, and wellness programmes in a tropical garden.', 'https://www.heritageresorts.mu/', 'spa', false),
('Amplify Studio', 'amplify-studio', 'Central', 'Beau Bassin', 'Pilates studio in Beau Bassin-Rose Hill with experienced instructors focusing on individual needs. Classes for all levels in a modern, supportive space.', NULL, 'spa', false),
('Le Jadis Spa & Wellness', 'le-jadis-spa-wellness', 'North', 'Balaclava', 'Award-winning spa with hydrotherapy and thermotherapy facilities, beauty salon, and fitness centre. Luxury treatments overlooking the northwest lagoon.', 'https://www.lejadis.com/spa-wellness/', 'spa', false)
ON CONFLICT (slug) DO NOTHING;


-- =====================================================
-- TOURS & ACTIVITIES (15 — diving, hiking, water sports, cultural)
-- =====================================================

INSERT INTO businesses (name, slug, region, address, description, website, category, is_claimed) VALUES
('Pro Dive Mauritius', 'pro-dive-mauritius', 'North', 'Trou aux Biches', 'SSI dive centre on the northwest coast just metres from the sea. Offers courses from beginner to professional, with access to the beautiful reefs of Trou aux Biches and Mont Choisy.', 'https://prodivemauritius.com/', 'tour', false),
('Sun Divers Mauritius', 'sun-divers-mauritius', 'West', 'Flic en Flac', 'Mauritius''s first PADI diving centre with over 20 years of experience. Two boats accessing 30+ dive sites from Flic en Flac. Also a 5-star SSI and CMAS centre.', 'https://www.sundiversmauritius.com/', 'tour', false),
('Dive Passion Mauritius', 'dive-passion-mauritius', 'East', 'Belle Mare', 'Run by Ben Cadet, a pioneer of scuba diving in Mauritius with 39 years experience. Personalised small-group dives across 15 sites near Belle Mare.', 'https://www.divepassionmauritius.com/', 'tour', false),
('Blue Water Diving Centre', 'blue-water-diving-centre', 'West', 'Flic en Flac', 'Award-winning sustainable diving centre guided by renowned naturalist Hugues Vitry. First certified sustainable tourism diving centre in Mauritius.', 'http://bluewaterdivingcentre.com/', 'tour', false),
('Scuba World Diving Mauritius', 'scuba-world-diving', 'South', 'Mahebourg', 'PADI 5-Star Dive Resort in Mahebourg offering courses and fun dives in the south. Access to pristine reefs and the Blue Bay Marine Park.', 'https://scubaworld-mauritius.com/', 'tour', false),
('Just Diving', 'just-diving-mauritius', 'North', 'Bain Boeuf', 'PADI 5-star dive facility directly on the beach at Bain Boeuf. Courses from beginner to dive master including deep, night, and wreck diving specialities.', 'https://justdivingmauritius.com/', 'tour', false),
('Vertical World', 'vertical-world-mauritius', 'Central', 'Curepipe', 'Outdoor adventure company in Curepipe offering rock climbing, abseiling, canyoning, and hiking excursions across the island''s mountains and gorges.', NULL, 'tour', false),
('Yanature', 'yanature-mauritius', 'Central', 'Port Louis', 'Highly-rated hiking and nature tour operator with 700+ reviews. Guided treks, camping, climbing, and wildlife tours exploring Mauritius''s hidden natural gems.', NULL, 'tour', false),
('Electrobike Mauritius', 'electrobike-mauritius', 'South', 'Bel Ombre', 'Guided electric bike tours discovering the wild south coast and its cliffs. 40km routes through fishing villages, historical sites, and Chamarel coloured earth.', 'https://www.electrobike.mu/', 'tour', false),
('Explore Nou Zil', 'explore-nou-zil', 'South', 'Bel Ombre', 'Family-owned electric bike and walking tour operator sharing off-the-beaten-track places in Mauritius. Eco-friendly guided tours respecting nature and local culture.', 'https://explorenouzil.com/', 'tour', false),
('TravelHub Mauritius', 'travelhub-mauritius', 'North', 'Grand Baie', 'Trusted tour operator with 1,200+ satisfied customers and a perfect 5/5 rating. Airport transfers, island tours, water activities, and custom experiences.', 'https://travelhub-mu.com/', 'tour', false),
('I Keep The Pace', 'i-keep-the-pace', 'Central', 'Port Louis', 'Certified hiking and trekking guide company organising nature walks, cultural tours, and mountain climbs including Le Morne Brabant and Le Pouce summits.', NULL, 'tour', false),
('L''Aventure du Sucre', 'laventure-du-sucre', 'North', 'Pamplemousses', 'Interactive sugar museum at Pamplemousses telling the story of Mauritius through sugar. Guided tours, rum tasting, and a gift shop in a restored factory.', 'https://www.aventuredusucre.com/', 'tour', false),
('Chateau Labourdonnais', 'chateau-labourdonnais', 'North', 'Mapou', 'Restored 19th-century colonial estate offering guided tours, rum distillery visits, orchard walks, and a boutique. A cultural and gastronomic heritage experience.', 'https://www.chateaulabourdonnais.com/', 'tour', false),
('Mauritius Aquarium', 'mauritius-aquarium', 'North', 'Pointe aux Piments', 'Marine discovery centre showcasing the rich biodiversity of Mauritian waters. Touch pools, fish feeding, and educational exhibits for families and ocean lovers.', NULL, 'tour', false)
ON CONFLICT (slug) DO NOTHING;


-- =====================================================
-- CAR RENTAL (10 — local operators)
-- =====================================================

INSERT INTO businesses (name, slug, region, address, description, website, category, is_claimed) VALUES
('Royal Car Rental', 'royal-car-rental', 'Central', 'SSR Airport', 'Leading local car rental provider at SSR International Airport. Reliable vehicles, competitive pricing, and island-wide delivery service.', 'https://carrentalmauritius.com/', 'car_rental', false),
('Royal Adventure Cars', 'royal-adventure-cars', 'Central', 'SSR Airport', 'Fast and affordable car rental service tailored for tourists. Modern fleet featuring fuel-efficient vehicles with free GPS and airport delivery.', 'https://www.royaladventurecars.com/', 'car_rental', false),
('Morisoleil Car Rental', 'morisoleil-car-rental', 'South', 'Trois Boutiques', 'Local car hire company near SSR Airport in the southeast. Affordable rates, well-maintained vehicles, and convenient airport pickup and drop-off.', NULL, 'car_rental', false),
('Ebrahim Tours', 'ebrahim-tours-car-rental', 'North', 'Grand Baie', 'Highly recommended local operator based in Grand Baie offering car hire with island-wide delivery. Personal service and honest advice for visitors.', NULL, 'car_rental', false),
('Autorent Mauritius', 'autorent-mauritius', 'Central', 'SSR Airport', 'Budget-friendly car rental with airport counter. Wide selection of economy and mid-range vehicles with transparent pricing and no hidden fees.', NULL, 'car_rental', false),
('Coastal Tours Car Rental', 'coastal-tours-car-rental', 'North', 'Grand Baie', 'Combined tour and car rental operator in Grand Baie. Flexible rental packages, guided tours, and knowledgeable staff with local expertise.', NULL, 'car_rental', false),
('Mauritius Car Rental', 'mauritius-car-rental-co', 'South', 'Trois Boutiques', 'Established car hire company minutes from the airport offering free GPS, child seats, and comprehensive insurance. Smooth booking and friendly service.', 'https://www.mauritiuscarental.com/', 'car_rental', false),
('AKD Car Rental', 'akd-car-rental', 'Central', 'SSR Airport', 'Local rental company serving SSR Airport with a range of economy to premium vehicles. Affordable daily rates with unlimited mileage and full coverage options.', NULL, 'car_rental', false),
('IDrive Mauritius', 'idrive-mauritius', 'Central', 'SSR Airport', 'Modern car rental service with online booking and airport pickup. Clean, recent-model vehicles with 24/7 roadside assistance across the island.', NULL, 'car_rental', false),
('Rentiles Mauritius', 'rentiles-mauritius', 'Central', 'SSR Airport', 'Car rental comparison and booking platform for Mauritius. Partners with local agencies to offer the best rates with flexible cancellation policies.', 'https://www.rentiles.com/car-rental-mauritius.html', 'car_rental', false)
ON CONFLICT (slug) DO NOTHING;


-- =====================================================
-- SERVICES (15 — hairdressers, real estate, gyms, etc.)
-- =====================================================

INSERT INTO businesses (name, slug, region, address, description, website, category, is_claimed) VALUES
('Maison Sasha Hair & Beauty', 'maison-sasha', 'Central', 'Quatre Bornes', 'Premier hair and beauty salon with multiple locations across Mauritius. Full range of services from haircuts and colour to luxurious beauty treatments.', 'https://www.maison-sasha.com/', 'services', false),
('Mooi Hair Salon', 'mooi-hair-salon', 'North', 'Grand Baie', 'Stylish hair salon born in South Africa and established in Mauritius. Created by experienced stylists offering cuts, colour, and treatments in a modern setting.', 'https://mooi.hair/', 'services', false),
('SPARC Mauritius', 'sparc-mauritius', 'West', 'Cascavelle', 'The largest multi-sport facility and members club on the west coast. Gym, swimming pool, tennis, fitness classes, a clubhouse, and a comprehensive health centre.', 'https://sparc.mu/', 'services', false),
('Synergy Sport & Wellness Institute', 'synergy-sport-wellness', 'Central', 'Moka', 'Premier fitness facility combining gym, group exercise studios, spinning, heated pools, and tennis courts. Also offers osteopathy and acupuncture at The Hive.', NULL, 'services', false),
('CrossFit Tamarin', 'crossfit-tamarin', 'West', 'Tamarin', 'Tight-knit CrossFit community in Tamarin where coaches know each member personally and adapt workouts to individual goals and fitness levels.', 'https://www.crossfittamarin.com/', 'services', false),
('CrossFit Grand Baie', 'crossfit-grand-baie', 'North', 'Grand Baie', 'The first affiliated CrossFit box in Mauritius with a 300m2 training space. Beginner-friendly with expert coaching and a welcoming fitness community.', 'https://www.crossfitgrandbaie.com/', 'services', false),
('Pam Golding Properties Mauritius', 'pam-golding-mauritius', 'North', 'Pointe aux Canonniers', 'International real estate agency specialising in luxury properties across Mauritius. Sales, rentals, and expert advice for local and foreign buyers.', 'https://www.pamgolding.mu/', 'services', false),
('DECORDIER Immobilier', 'decordier-immobilier', 'North', 'Grand Baie', 'Established real estate agency in Mauritius offering property sales, rentals, and investment advice. Local expertise with personalised client service.', 'https://www.decordier-immobilier.mu/', 'services', false),
('Park Lane Properties', 'park-lane-properties', 'North', 'Grand Baie', 'Independent family-owned boutique real estate agency and exclusive Christie''s International affiliate in Mauritius. Over 20 years in the market.', 'https://parklane.mu/', 'services', false),
('Mauritius Sotheby''s International Realty', 'sothebys-realty-mauritius', 'Central', 'Ebene', 'Prestigious real estate brand offering luxury residential and commercial properties. Access to an exclusive global network of high-net-worth buyers.', NULL, 'services', false),
('Golden Capture Studio', 'golden-capture-studio', 'West', 'Flic en Flac', 'Professional photography and videography studio specialising in weddings, beach photoshoots, and cinematic films against Mauritius''s stunning backdrops.', 'https://www.golden-capture.com/', 'services', false),
('Tropic Photography Mauritius', 'tropic-photography', 'North', 'Grand Baie', 'Professional photographer offering beach weddings, pre-wedding shoots, engagement, couples, honeymoon, and family photography across the island.', 'https://www.tropicpix.com/', 'services', false),
('Marry Me Mauritius', 'marry-me-mauritius', 'West', 'Flic en Flac', 'Passionate destination wedding planning collective curating bespoke ceremonies and receptions across Mauritius. Full coordination from venue to vendors.', 'https://marrymemauritius.com/', 'services', false),
('Coco Blush Events', 'coco-blush-events', 'West', 'Black River', 'UK-based destination wedding planner partnered with luxury Mauritian venues. The only independent UK Mauritius wedding specialist for overseas couples.', 'https://www.cocoblushevents.com/', 'services', false),
('Fotoshoot Productions', 'fotoshoot-productions', 'Port Louis', 'Port Louis', 'Award-winning photography and film studio led by Jean Jacques Fabien with 20+ years experience. Wedding, commercial, and fashion photography.', 'http://www.fotoshootprod.com/', 'services', false)
ON CONFLICT (slug) DO NOTHING;
