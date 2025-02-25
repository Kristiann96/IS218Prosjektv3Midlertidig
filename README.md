# IS-218-oppgave2-gruppe10
# KUN UTKAST/FORSLAG!

- [Problemstilling](#problemstilling)
- [Målsetning](#målsetning)
- [Teknologivalg](#teknologivalg)
- [Datasettene](#datasettene)
- [Metode og implementering](#metode_og_implementering)
- [Mulig videre arbeid og utvidelser](#Mulig_videre_arbeid_og_utvidelser)
- [Kildekode og brukerveiledning](#Kildekode_og_brukerveiledning)
- [Konklusjon](#konklusjon)
- [Kilder](#kilder)



# 📌 Problemstilling
I en krisesituasjon er tilgang til trygge tilfluktsrom avgjørende for befolkningens sikkerhet. I Agder fylke bor det 319 644 personer[Lenke til kilde](https://kartkatalog.geonorge.no/metadata/befolkning-paa-grunnkretsniv/7eb907de-fdaa-4442-a8eb-e4bd06da9ca8?search=befolkning) , men kapasiteten i offentlige tilfluktsrom er kun 16 773 plasser [Lenke til kilde](https://kartkatalog.geonorge.no/metadata/tilfluktsrom-offentlige/dbae9aae-10e7-4b75-8d67-7f0e8828f3d8?search=tilfluktsrom) . Dette betyr at det i gjennomsnitt er 1 plass per 19 innbyggere, noe som indikerer en alvorlig mangel på tilgjengelige tilfluktsrom.

Denne applikasjonen undersøker følgende spørsmål:

Er det nok tilfluktsrom i Agder til å dekke behovet i en krisesituasjon?
Hvilke områder har størst kapasitetsutfordringer?
Kan alternativer, som enkle "basic huts" fra OpenStreetMap, bidra til å gi inbyggere tilfluktssteder?

# 🎯 Målsetning
Prosjektets formål er å utvikle en nettbasert applikasjon som:
✅ Lar brukeren finne nærmeste tilfluktsrom basert på sin posisjon.
✅ Visualiserer overbelastning av tilfluktsrom ved å sammenligne befolkningstall med kapasitet.
✅ Utforsker alternative tilfluktsmuligheter, som for eksempel turistforeningens hytter (basic_hut fra OSM).

# 🗺️ Teknologivalg
BLABLABLABLA
BLABLABLABLA
BLABLABLABLA
BLABLABLABLA

# 📊 Datasettene
Prosjektet benytter tre primære datasett:

Befolkningsdata: Antall innbyggere i Agder.[Lenke til kilde -geonorge.no](https://kartkatalog.geonorge.no/metadata/befolkning-paa-grunnkretsniv/7eb907de-fdaa-4442-a8eb-e4bd06da9ca8?search=befolkning) 
Tilfluktsrom: Offisielle tilfluktsrom med informasjon om kapasitet.[Lenke til kilde - geonorge.no](https://kartkatalog.geonorge.no/metadata/tilfluktsrom-offentlige/dbae9aae-10e7-4b75-8d67-7f0e8828f3d8?search=tilfluktsrom) 
Basic_hut-shelters: Filtrert datasett som viser enkle hytter i mindre sentrale strøk i Agder [Lenket til kilde - OpenStreetMap.org](https://www.openstreetmap.org).

# 🔍 Metode og implementering

1️⃣ Kartlegging av tilfluktsromskapasitet per område
Ved hjelp av PostGIS analyseres forholdet mellom befolkningstall og kapasitet for tilfluktsrom i hvert område. 
Spørringen under beregner antall mennesker per tilgjengelig tilfluktsromsplass:

2️⃣ Brukerinteraksjon – Finn nærmeste tilfluktsrom
Brukeren kan tillate geolokasjon, og systemet vil finne det nærmeste tilfluktsrommet:
🏢 Nærmeste offentlige tilfluktsrom vises med avstand i kilometer.
⛺ Alternativt basic_hut tilbys dersom ingen offentlige rom er i nærheten.

3️⃣ Interaktiv kartvisning
Røde prikker 🔴 = overbelastede tilfluktsrom.
Gule prikker 🟡 = moderat kapasitet.
Grønne prikker 🟢 = Tilstrekkelig plass ( SANSYNLIGVIS IKKE BRUKT).
Brukerens posisjon 📍 kan vises for å gi en personlig tilpassning.
🔹 Kartlaget kan filtreres mellom offentlige tilfluktsrom og basic huts.

# 📢 Mulig videre arbeid og atvidelser
✅ Utvidelse av datasett: Inkludere flere attributter, f.eks. ?????????????.
✅ Sanntidsoppdateringer: Oppkobling mot API-er for oppdatert tilgjengelig kapasitet i nødsituasjon.
✅ Trafikkanalyse: Estimere reisetid til nærmeste tilfluktsrom.

# 📂 Kildekode og brukerveiledning
🔗 GitHub Repository: [Legg til lenke her]
📄 Hvordan kjøre prosjektet:
📝 Avhengigheter: 
BLABLABLABLABLABAL
BLABLABLABLABLABAL
BLABLABLABLABLABAL
BLABLABLABLABLABAL


# 📜 Konklusjon
Denne applikasjonen demonstrerer hvordan geografisk IT-utvikling kan brukes til å analysere og forbedre samfunnsberedskap. Ved å kombinere befolkningsdata, tilfluktsromsinformasjon og alternative tilfluktsmuligheter kan det avdekkes kritiske mangler i nødberedskap og gi brukere nyttig informasjon om nærmeste sikre eller alternative tilfluktssted.

# 📚 Kilder
Kartverket / GeoNorge: https://kartkatalog.geonorge.no
OpenStreetMap: https://www.openstreetmap.org
PostGIS Dokumentasjon: https://postgis.net/documentation/
Supabase API: https://supabase.com/docs/
