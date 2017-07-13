/**
 *
 * @author <David Patzke david.patzke@wheregroup.com>
 * @copyright 08.06.17 by WhereGroup GmbH & Co. KG
 */

(function addAxisOrder() {

    'use strict';

    var codes = [{
        "EPSG:2036": {yx: true}

    }, {
        "EPSG:2044": {yx: true}

    }, {
        "EPSG:2045": {yx: true}

    }, {
        "EPSG:2065": {yx: true}

    }, {
        "EPSG:2081": {yx: true}

    }, {
        "EPSG:2082": {yx: true}

    }, {
        "EPSG:2083": {yx: true}

    }, {
        "EPSG:2085": {yx: true}

    }, {
        "EPSG:2086": {yx: true}

    }, {
        "EPSG:2091": {yx: true}

    }, {
        "EPSG:2092": {yx: true}

    }, {
        "EPSG:2093": {yx: true}

    }, {
        "EPSG:2096": {yx: true}

    }, {
        "EPSG:2097": {yx: true}

    }, {
        "EPSG:2098": {yx: true}

    }, {
        "EPSG:2105": {yx: true}

    }, {
        "EPSG:2106": {yx: true}

    }, {
        "EPSG:2107": {yx: true}

    }, {
        "EPSG:2108": {yx: true}

    }, {
        "EPSG:2109": {yx: true}

    }, {
        "EPSG:2110": {yx: true}

    }, {
        "EPSG:2111": {yx: true}

    }, {
        "EPSG:2112": {yx: true}

    }, {
        "EPSG:2113": {yx: true}

    }, {
        "EPSG:2114": {yx: true}

    }, {
        "EPSG:2115": {yx: true}

    }, {
        "EPSG:2116": {yx: true}

    }, {
        "EPSG:2117": {yx: true}

    }, {
        "EPSG:2118": {yx: true}

    }, {
        "EPSG:2119": {yx: true}

    }, {
        "EPSG:2120": {yx: true}

    }, {
        "EPSG:2121": {yx: true}

    }, {
        "EPSG:2122": {yx: true}

    }, {
        "EPSG:2123": {yx: true}

    }, {
        "EPSG:2124": {yx: true}

    }, {
        "EPSG:2125": {yx: true}

    }, {
        "EPSG:2126": {yx: true}

    }, {
        "EPSG:2127": {yx: true}

    }, {
        "EPSG:2128": {yx: true}

    }, {
        "EPSG:2129": {yx: true}

    }, {
        "EPSG:2130": {yx: true}

    }, {
        "EPSG:2131": {yx: true}

    }, {
        "EPSG:2132": {yx: true}

    }, {
        "EPSG:2166": {yx: true}

    }, {
        "EPSG:2167": {yx: true}

    }, {
        "EPSG:2168": {yx: true}

    }, {
        "EPSG:2169": {yx: true}

    }, {
        "EPSG:2170": {yx: true}

    }, {
        "EPSG:2171": {yx: true}

    }, {
        "EPSG:2172": {yx: true}

    }, {
        "EPSG:2173": {yx: true}

    }, {
        "EPSG:2174": {yx: true}

    }, {
        "EPSG:2175": {yx: true}

    }, {
        "EPSG:2176": {yx: true}

    }, {
        "EPSG:2177": {yx: true}

    }, {
        "EPSG:2178": {yx: true}

    }, {
        "EPSG:2179": {yx: true}

    }, {
        "EPSG:2180": {yx: true}

    }, {
        "EPSG:2193": {yx: true}

    }, {
        "EPSG:2199": {yx: true}

    }, {
        "EPSG:2200": {yx: true}

    }, {
        "EPSG:2206": {yx: true}

    }, {
        "EPSG:2207": {yx: true}

    }, {
        "EPSG:2208": {yx: true}

    }, {
        "EPSG:2209": {yx: true}

    }, {
        "EPSG:2210": {yx: true}

    }, {
        "EPSG:2211": {yx: true}

    }, {
        "EPSG:2212": {yx: true}

    }, {
        "EPSG:2319": {yx: true}

    }, {
        "EPSG:2320": {yx: true}

    }, {
        "EPSG:2321": {yx: true}

    }, {
        "EPSG:2322": {yx: true}

    }, {
        "EPSG:2323": {yx: true}

    }, {
        "EPSG:2324": {yx: true}

    }, {
        "EPSG:2325": {yx: true}

    }, {
        "EPSG:2326": {yx: true}

    }, {
        "EPSG:2327": {yx: true}

    }, {
        "EPSG:2328": {yx: true}

    }, {
        "EPSG:2329": {yx: true}

    }, {
        "EPSG:2330": {yx: true}

    }, {
        "EPSG:2331": {yx: true}

    }, {
        "EPSG:2332": {yx: true}

    }, {
        "EPSG:2333": {yx: true}

    }, {
        "EPSG:2334": {yx: true}

    }, {
        "EPSG:2335": {yx: true}

    }, {
        "EPSG:2336": {yx: true}

    }, {
        "EPSG:2337": {yx: true}

    }, {
        "EPSG:2338": {yx: true}

    }, {
        "EPSG:2339": {yx: true}

    }, {
        "EPSG:2340": {yx: true}

    }, {
        "EPSG:2341": {yx: true}

    }, {
        "EPSG:2342": {yx: true}

    }, {
        "EPSG:2343": {yx: true}

    }, {
        "EPSG:2344": {yx: true}

    }, {
        "EPSG:2345": {yx: true}

    }, {
        "EPSG:2346": {yx: true}

    }, {
        "EPSG:2347": {yx: true}

    }, {
        "EPSG:2348": {yx: true}

    }, {
        "EPSG:2349": {yx: true}

    }, {
        "EPSG:2350": {yx: true}

    }, {
        "EPSG:2351": {yx: true}

    }, {
        "EPSG:2352": {yx: true}

    }, {
        "EPSG:2353": {yx: true}

    }, {
        "EPSG:2354": {yx: true}

    }, {
        "EPSG:2355": {yx: true}

    }, {
        "EPSG:2356": {yx: true}

    }, {
        "EPSG:2357": {yx: true}

    }, {
        "EPSG:2358": {yx: true}

    }, {
        "EPSG:2359": {yx: true}

    }, {
        "EPSG:2360": {yx: true}

    }, {
        "EPSG:2361": {yx: true}

    }, {
        "EPSG:2362": {yx: true}

    }, {
        "EPSG:2363": {yx: true}

    }, {
        "EPSG:2364": {yx: true}

    }, {
        "EPSG:2365": {yx: true}

    }, {
        "EPSG:2366": {yx: true}

    }, {
        "EPSG:2367": {yx: true}

    }, {
        "EPSG:2368": {yx: true}

    }, {
        "EPSG:2369": {yx: true}

    }, {
        "EPSG:2370": {yx: true}

    }, {
        "EPSG:2371": {yx: true}

    }, {
        "EPSG:2372": {yx: true}

    }, {
        "EPSG:2373": {yx: true}

    }, {
        "EPSG:2374": {yx: true}

    }, {
        "EPSG:2375": {yx: true}

    }, {
        "EPSG:2376": {yx: true}

    }, {
        "EPSG:2377": {yx: true}

    }, {
        "EPSG:2378": {yx: true}

    }, {
        "EPSG:2379": {yx: true}

    }, {
        "EPSG:2380": {yx: true}

    }, {
        "EPSG:2381": {yx: true}

    }, {
        "EPSG:2382": {yx: true}

    }, {
        "EPSG:2383": {yx: true}

    }, {
        "EPSG:2384": {yx: true}

    }, {
        "EPSG:2385": {yx: true}

    }, {
        "EPSG:2386": {yx: true}

    }, {
        "EPSG:2387": {yx: true}

    }, {
        "EPSG:2388": {yx: true}

    }, {
        "EPSG:2389": {yx: true}

    }, {
        "EPSG:2390": {yx: true}

    }, {
        "EPSG:2391": {yx: true}

    }, {
        "EPSG:2392": {yx: true}

    }, {
        "EPSG:2393": {yx: true}

    }, {
        "EPSG:2394": {yx: true}

    }, {
        "EPSG:2395": {yx: true}

    }, {
        "EPSG:2396": {yx: true}

    }, {
        "EPSG:2397": {yx: true}

    }, {
        "EPSG:2398": {yx: true}

    }, {
        "EPSG:2399": {yx: true}

    }, {
        "EPSG:2400": {yx: true}

    }, {
        "EPSG:2401": {yx: true}

    }, {
        "EPSG:2402": {yx: true}

    }, {
        "EPSG:2403": {yx: true}

    }, {
        "EPSG:2404": {yx: true}

    }, {
        "EPSG:2405": {yx: true}

    }, {
        "EPSG:2406": {yx: true}

    }, {
        "EPSG:2407": {yx: true}

    }, {
        "EPSG:2408": {yx: true}

    }, {
        "EPSG:2409": {yx: true}

    }, {
        "EPSG:2410": {yx: true}

    }, {
        "EPSG:2411": {yx: true}

    }, {
        "EPSG:2412": {yx: true}

    }, {
        "EPSG:2413": {yx: true}

    }, {
        "EPSG:2414": {yx: true}

    }, {
        "EPSG:2415": {yx: true}

    }, {
        "EPSG:2416": {yx: true}

    }, {
        "EPSG:2417": {yx: true}

    }, {
        "EPSG:2418": {yx: true}

    }, {
        "EPSG:2419": {yx: true}

    }, {
        "EPSG:2420": {yx: true}

    }, {
        "EPSG:2421": {yx: true}

    }, {
        "EPSG:2422": {yx: true}

    }, {
        "EPSG:2423": {yx: true}

    }, {
        "EPSG:2424": {yx: true}

    }, {
        "EPSG:2425": {yx: true}

    }, {
        "EPSG:2426": {yx: true}

    }, {
        "EPSG:2427": {yx: true}

    }, {
        "EPSG:2428": {yx: true}

    }, {
        "EPSG:2429": {yx: true}

    }, {
        "EPSG:2430": {yx: true}

    }, {
        "EPSG:2431": {yx: true}

    }, {
        "EPSG:2432": {yx: true}

    }, {
        "EPSG:2433": {yx: true}

    }, {
        "EPSG:2434": {yx: true}

    }, {
        "EPSG:2435": {yx: true}

    }, {
        "EPSG:2436": {yx: true}

    }, {
        "EPSG:2437": {yx: true}

    }, {
        "EPSG:2438": {yx: true}

    }, {
        "EPSG:2439": {yx: true}

    }, {
        "EPSG:2440": {yx: true}

    }, {
        "EPSG:2441": {yx: true}

    }, {
        "EPSG:2442": {yx: true}

    }, {
        "EPSG:2443": {yx: true}

    }, {
        "EPSG:2444": {yx: true}

    }, {
        "EPSG:2445": {yx: true}

    }, {
        "EPSG:2446": {yx: true}

    }, {
        "EPSG:2447": {yx: true}

    }, {
        "EPSG:2448": {yx: true}

    }, {
        "EPSG:2449": {yx: true}

    }, {
        "EPSG:2450": {yx: true}

    }, {
        "EPSG:2451": {yx: true}

    }, {
        "EPSG:2452": {yx: true}

    }, {
        "EPSG:2453": {yx: true}

    }, {
        "EPSG:2454": {yx: true}

    }, {
        "EPSG:2455": {yx: true}

    }, {
        "EPSG:2456": {yx: true}

    }, {
        "EPSG:2457": {yx: true}

    }, {
        "EPSG:2458": {yx: true}

    }, {
        "EPSG:2459": {yx: true}

    }, {
        "EPSG:2460": {yx: true}

    }, {
        "EPSG:2461": {yx: true}

    }, {
        "EPSG:2462": {yx: true}

    }, {
        "EPSG:2463": {yx: true}

    }, {
        "EPSG:2464": {yx: true}

    }, {
        "EPSG:2465": {yx: true}

    }, {
        "EPSG:2466": {yx: true}

    }, {
        "EPSG:2467": {yx: true}

    }, {
        "EPSG:2468": {yx: true}

    }, {
        "EPSG:2469": {yx: true}

    }, {
        "EPSG:2470": {yx: true}

    }, {
        "EPSG:2471": {yx: true}

    }, {
        "EPSG:2472": {yx: true}

    }, {
        "EPSG:2473": {yx: true}

    }, {
        "EPSG:2474": {yx: true}

    }, {
        "EPSG:2475": {yx: true}

    }, {
        "EPSG:2476": {yx: true}

    }, {
        "EPSG:2477": {yx: true}

    }, {
        "EPSG:2478": {yx: true}

    }, {
        "EPSG:2479": {yx: true}

    }, {
        "EPSG:2480": {yx: true}

    }, {
        "EPSG:2481": {yx: true}

    }, {
        "EPSG:2482": {yx: true}

    }, {
        "EPSG:2483": {yx: true}

    }, {
        "EPSG:2484": {yx: true}

    }, {
        "EPSG:2485": {yx: true}

    }, {
        "EPSG:2486": {yx: true}

    }, {
        "EPSG:2487": {yx: true}

    }, {
        "EPSG:2488": {yx: true}

    }, {
        "EPSG:2489": {yx: true}

    }, {
        "EPSG:2490": {yx: true}

    }, {
        "EPSG:2491": {yx: true}

    }, {
        "EPSG:2492": {yx: true}

    }, {
        "EPSG:2493": {yx: true}

    }, {
        "EPSG:2494": {yx: true}

    }, {
        "EPSG:2495": {yx: true}

    }, {
        "EPSG:2496": {yx: true}

    }, {
        "EPSG:2497": {yx: true}

    }, {
        "EPSG:2498": {yx: true}

    }, {
        "EPSG:2499": {yx: true}

    }, {
        "EPSG:2500": {yx: true}

    }, {
        "EPSG:2501": {yx: true}

    }, {
        "EPSG:2502": {yx: true}

    }, {
        "EPSG:2503": {yx: true}

    }, {
        "EPSG:2504": {yx: true}

    }, {
        "EPSG:2505": {yx: true}

    }, {
        "EPSG:2506": {yx: true}

    }, {
        "EPSG:2507": {yx: true}

    }, {
        "EPSG:2508": {yx: true}

    }, {
        "EPSG:2509": {yx: true}

    }, {
        "EPSG:2510": {yx: true}

    }, {
        "EPSG:2511": {yx: true}

    }, {
        "EPSG:2512": {yx: true}

    }, {
        "EPSG:2513": {yx: true}

    }, {
        "EPSG:2514": {yx: true}

    }, {
        "EPSG:2515": {yx: true}

    }, {
        "EPSG:2516": {yx: true}

    }, {
        "EPSG:2517": {yx: true}

    }, {
        "EPSG:2518": {yx: true}

    }, {
        "EPSG:2519": {yx: true}

    }, {
        "EPSG:2520": {yx: true}

    }, {
        "EPSG:2521": {yx: true}

    }, {
        "EPSG:2522": {yx: true}

    }, {
        "EPSG:2523": {yx: true}

    }, {
        "EPSG:2524": {yx: true}

    }, {
        "EPSG:2525": {yx: true}

    }, {
        "EPSG:2526": {yx: true}

    }, {
        "EPSG:2527": {yx: true}

    }, {
        "EPSG:2528": {yx: true}

    }, {
        "EPSG:2529": {yx: true}

    }, {
        "EPSG:2530": {yx: true}

    }, {
        "EPSG:2531": {yx: true}

    }, {
        "EPSG:2532": {yx: true}

    }, {
        "EPSG:2533": {yx: true}

    }, {
        "EPSG:2534": {yx: true}

    }, {
        "EPSG:2535": {yx: true}

    }, {
        "EPSG:2536": {yx: true}

    }, {
        "EPSG:2537": {yx: true}

    }, {
        "EPSG:2538": {yx: true}

    }, {
        "EPSG:2539": {yx: true}

    }, {
        "EPSG:2540": {yx: true}

    }, {
        "EPSG:2541": {yx: true}

    }, {
        "EPSG:2542": {yx: true}

    }, {
        "EPSG:2543": {yx: true}

    }, {
        "EPSG:2544": {yx: true}

    }, {
        "EPSG:2545": {yx: true}

    }, {
        "EPSG:2546": {yx: true}

    }, {
        "EPSG:2547": {yx: true}

    }, {
        "EPSG:2548": {yx: true}

    }, {
        "EPSG:2549": {yx: true}

    }, {
        "EPSG:2551": {yx: true}

    }, {
        "EPSG:2552": {yx: true}

    }, {
        "EPSG:2553": {yx: true}

    }, {
        "EPSG:2554": {yx: true}

    }, {
        "EPSG:2555": {yx: true}

    }, {
        "EPSG:2556": {yx: true}

    }, {
        "EPSG:2557": {yx: true}

    }, {
        "EPSG:2558": {yx: true}

    }, {
        "EPSG:2559": {yx: true}

    }, {
        "EPSG:2560": {yx: true}

    }, {
        "EPSG:2561": {yx: true}

    }, {
        "EPSG:2562": {yx: true}

    }, {
        "EPSG:2563": {yx: true}

    }, {
        "EPSG:2564": {yx: true}

    }, {
        "EPSG:2565": {yx: true}

    }, {
        "EPSG:2566": {yx: true}

    }, {
        "EPSG:2567": {yx: true}

    }, {
        "EPSG:2568": {yx: true}

    }, {
        "EPSG:2569": {yx: true}

    }, {
        "EPSG:2570": {yx: true}

    }, {
        "EPSG:2571": {yx: true}

    }, {
        "EPSG:2572": {yx: true}

    }, {
        "EPSG:2573": {yx: true}

    }, {
        "EPSG:2574": {yx: true}

    }, {
        "EPSG:2575": {yx: true}

    }, {
        "EPSG:2576": {yx: true}

    }, {
        "EPSG:2577": {yx: true}

    }, {
        "EPSG:2578": {yx: true}

    }, {
        "EPSG:2579": {yx: true}

    }, {
        "EPSG:2580": {yx: true}

    }, {
        "EPSG:2581": {yx: true}

    }, {
        "EPSG:2582": {yx: true}

    }, {
        "EPSG:2583": {yx: true}

    }, {
        "EPSG:2584": {yx: true}

    }, {
        "EPSG:2585": {yx: true}

    }, {
        "EPSG:2586": {yx: true}

    }, {
        "EPSG:2587": {yx: true}

    }, {
        "EPSG:2588": {yx: true}

    }, {
        "EPSG:2589": {yx: true}

    }, {
        "EPSG:2590": {yx: true}

    }, {
        "EPSG:2591": {yx: true}

    }, {
        "EPSG:2592": {yx: true}

    }, {
        "EPSG:2593": {yx: true}

    }, {
        "EPSG:2594": {yx: true}

    }, {
        "EPSG:2595": {yx: true}

    }, {
        "EPSG:2596": {yx: true}

    }, {
        "EPSG:2597": {yx: true}

    }, {
        "EPSG:2598": {yx: true}

    }, {
        "EPSG:2599": {yx: true}

    }, {
        "EPSG:2600": {yx: true}

    }, {
        "EPSG:2601": {yx: true}

    }, {
        "EPSG:2602": {yx: true}

    }, {
        "EPSG:2603": {yx: true}

    }, {
        "EPSG:2604": {yx: true}

    }, {
        "EPSG:2605": {yx: true}

    }, {
        "EPSG:2606": {yx: true}

    }, {
        "EPSG:2607": {yx: true}

    }, {
        "EPSG:2608": {yx: true}

    }, {
        "EPSG:2609": {yx: true}

    }, {
        "EPSG:2610": {yx: true}

    }, {
        "EPSG:2611": {yx: true}

    }, {
        "EPSG:2612": {yx: true}

    }, {
        "EPSG:2613": {yx: true}

    }, {
        "EPSG:2614": {yx: true}

    }, {
        "EPSG:2615": {yx: true}

    }, {
        "EPSG:2616": {yx: true}

    }, {
        "EPSG:2617": {yx: true}

    }, {
        "EPSG:2618": {yx: true}

    }, {
        "EPSG:2619": {yx: true}

    }, {
        "EPSG:2620": {yx: true}

    }, {
        "EPSG:2621": {yx: true}

    }, {
        "EPSG:2622": {yx: true}

    }, {
        "EPSG:2623": {yx: true}

    }, {
        "EPSG:2624": {yx: true}

    }, {
        "EPSG:2625": {yx: true}

    }, {
        "EPSG:2626": {yx: true}

    }, {
        "EPSG:2627": {yx: true}

    }, {
        "EPSG:2628": {yx: true}

    }, {
        "EPSG:2629": {yx: true}

    }, {
        "EPSG:2630": {yx: true}

    }, {
        "EPSG:2631": {yx: true}

    }, {
        "EPSG:2632": {yx: true}

    }, {
        "EPSG:2633": {yx: true}

    }, {
        "EPSG:2634": {yx: true}

    }, {
        "EPSG:2635": {yx: true}

    }, {
        "EPSG:2636": {yx: true}

    }, {
        "EPSG:2637": {yx: true}

    }, {
        "EPSG:2638": {yx: true}

    }, {
        "EPSG:2639": {yx: true}

    }, {
        "EPSG:2640": {yx: true}

    }, {
        "EPSG:2641": {yx: true}

    }, {
        "EPSG:2642": {yx: true}

    }, {
        "EPSG:2643": {yx: true}

    }, {
        "EPSG:2644": {yx: true}

    }, {
        "EPSG:2645": {yx: true}

    }, {
        "EPSG:2646": {yx: true}

    }, {
        "EPSG:2647": {yx: true}

    }, {
        "EPSG:2648": {yx: true}

    }, {
        "EPSG:2649": {yx: true}

    }, {
        "EPSG:2650": {yx: true}

    }, {
        "EPSG:2651": {yx: true}

    }, {
        "EPSG:2652": {yx: true}

    }, {
        "EPSG:2653": {yx: true}

    }, {
        "EPSG:2654": {yx: true}

    }, {
        "EPSG:2655": {yx: true}

    }, {
        "EPSG:2656": {yx: true}

    }, {
        "EPSG:2657": {yx: true}

    }, {
        "EPSG:2658": {yx: true}

    }, {
        "EPSG:2659": {yx: true}

    }, {
        "EPSG:2660": {yx: true}

    }, {
        "EPSG:2661": {yx: true}

    }, {
        "EPSG:2662": {yx: true}

    }, {
        "EPSG:2663": {yx: true}

    }, {
        "EPSG:2664": {yx: true}

    }, {
        "EPSG:2665": {yx: true}

    }, {
        "EPSG:2666": {yx: true}

    }, {
        "EPSG:2667": {yx: true}

    }, {
        "EPSG:2668": {yx: true}

    }, {
        "EPSG:2669": {yx: true}

    }, {
        "EPSG:2670": {yx: true}

    }, {
        "EPSG:2671": {yx: true}

    }, {
        "EPSG:2672": {yx: true}

    }, {
        "EPSG:2673": {yx: true}

    }, {
        "EPSG:2674": {yx: true}

    }, {
        "EPSG:2675": {yx: true}

    }, {
        "EPSG:2676": {yx: true}

    }, {
        "EPSG:2677": {yx: true}

    }, {
        "EPSG:2678": {yx: true}

    }, {
        "EPSG:2679": {yx: true}

    }, {
        "EPSG:2680": {yx: true}

    }, {
        "EPSG:2681": {yx: true}

    }, {
        "EPSG:2682": {yx: true}

    }, {
        "EPSG:2683": {yx: true}

    }, {
        "EPSG:2684": {yx: true}

    }, {
        "EPSG:2685": {yx: true}

    }, {
        "EPSG:2686": {yx: true}

    }, {
        "EPSG:2687": {yx: true}

    }, {
        "EPSG:2688": {yx: true}

    }, {
        "EPSG:2689": {yx: true}

    }, {
        "EPSG:2690": {yx: true}

    }, {
        "EPSG:2691": {yx: true}

    }, {
        "EPSG:2692": {yx: true}

    }, {
        "EPSG:2693": {yx: true}

    }, {
        "EPSG:2694": {yx: true}

    }, {
        "EPSG:2695": {yx: true}

    }, {
        "EPSG:2696": {yx: true}

    }, {
        "EPSG:2697": {yx: true}

    }, {
        "EPSG:2698": {yx: true}

    }, {
        "EPSG:2699": {yx: true}

    }, {
        "EPSG:2700": {yx: true}

    }, {
        "EPSG:2701": {yx: true}

    }, {
        "EPSG:2702": {yx: true}

    }, {
        "EPSG:2703": {yx: true}

    }, {
        "EPSG:2704": {yx: true}

    }, {
        "EPSG:2705": {yx: true}

    }, {
        "EPSG:2706": {yx: true}

    }, {
        "EPSG:2707": {yx: true}

    }, {
        "EPSG:2708": {yx: true}

    }, {
        "EPSG:2709": {yx: true}

    }, {
        "EPSG:2710": {yx: true}

    }, {
        "EPSG:2711": {yx: true}

    }, {
        "EPSG:2712": {yx: true}

    }, {
        "EPSG:2713": {yx: true}

    }, {
        "EPSG:2714": {yx: true}

    }, {
        "EPSG:2715": {yx: true}

    }, {
        "EPSG:2716": {yx: true}

    }, {
        "EPSG:2717": {yx: true}

    }, {
        "EPSG:2718": {yx: true}

    }, {
        "EPSG:2719": {yx: true}

    }, {
        "EPSG:2720": {yx: true}

    }, {
        "EPSG:2721": {yx: true}

    }, {
        "EPSG:2722": {yx: true}

    }, {
        "EPSG:2723": {yx: true}

    }, {
        "EPSG:2724": {yx: true}

    }, {
        "EPSG:2725": {yx: true}

    }, {
        "EPSG:2726": {yx: true}

    }, {
        "EPSG:2727": {yx: true}

    }, {
        "EPSG:2728": {yx: true}

    }, {
        "EPSG:2729": {yx: true}

    }, {
        "EPSG:2730": {yx: true}

    }, {
        "EPSG:2731": {yx: true}

    }, {
        "EPSG:2732": {yx: true}

    }, {
        "EPSG:2733": {yx: true}

    }, {
        "EPSG:2734": {yx: true}

    }, {
        "EPSG:2735": {yx: true}

    }, {
        "EPSG:2738": {yx: true}

    }, {
        "EPSG:2739": {yx: true}

    }, {
        "EPSG:2740": {yx: true}

    }, {
        "EPSG:2741": {yx: true}

    }, {
        "EPSG:2742": {yx: true}

    }, {
        "EPSG:2743": {yx: true}

    }, {
        "EPSG:2744": {yx: true}

    }, {
        "EPSG:2745": {yx: true}

    }, {
        "EPSG:2746": {yx: true}

    }, {
        "EPSG:2747": {yx: true}

    }, {
        "EPSG:2748": {yx: true}

    }, {
        "EPSG:2749": {yx: true}

    }, {
        "EPSG:2750": {yx: true}

    }, {
        "EPSG:2751": {yx: true}

    }, {
        "EPSG:2752": {yx: true}

    }, {
        "EPSG:2753": {yx: true}

    }, {
        "EPSG:2754": {yx: true}

    }, {
        "EPSG:2755": {yx: true}

    }, {
        "EPSG:2756": {yx: true}

    }, {
        "EPSG:2757": {yx: true}

    }, {
        "EPSG:2758": {yx: true}

    }, {
        "EPSG:2935": {yx: true}

    }, {
        "EPSG:2936": {yx: true}

    }, {
        "EPSG:2937": {yx: true}

    }, {
        "EPSG:2938": {yx: true}

    }, {
        "EPSG:2939": {yx: true}

    }, {
        "EPSG:2940": {yx: true}

    }, {
        "EPSG:2941": {yx: true}

    }, {
        "EPSG:2953": {yx: true}

    }, {
        "EPSG:2963": {yx: true}

    }, {
        "EPSG:3006": {yx: true}

    }, {
        "EPSG:3007": {yx: true}

    }, {
        "EPSG:3008": {yx: true}

    }, {
        "EPSG:3009": {yx: true}

    }, {
        "EPSG:3010": {yx: true}

    }, {
        "EPSG:3011": {yx: true}

    }, {
        "EPSG:3012": {yx: true}

    }, {
        "EPSG:3013": {yx: true}

    }, {
        "EPSG:3014": {yx: true}

    }, {
        "EPSG:3015": {yx: true}

    }, {
        "EPSG:3016": {yx: true}

    }, {
        "EPSG:3017": {yx: true}

    }, {
        "EPSG:3018": {yx: true}

    }, {
        "EPSG:3019": {yx: true}

    }, {
        "EPSG:3020": {yx: true}

    }, {
        "EPSG:3021": {yx: true}

    }, {
        "EPSG:3022": {yx: true}

    }, {
        "EPSG:3023": {yx: true}

    }, {
        "EPSG:3024": {yx: true}

    }, {
        "EPSG:3025": {yx: true}

    }, {
        "EPSG:3026": {yx: true}

    }, {
        "EPSG:3027": {yx: true}

    }, {
        "EPSG:3028": {yx: true}

    }, {
        "EPSG:3029": {yx: true}

    }, {
        "EPSG:3030": {yx: true}

    }, {
        "EPSG:3034": {yx: true}

    }, {
        "EPSG:3035": {yx: true}

    }, {
        "EPSG:3038": {yx: true}

    }, {
        "EPSG:3039": {yx: true}

    }, {
        "EPSG:3040": {yx: true}

    }, {
        "EPSG:3041": {yx: true}

    }, {
        "EPSG:3042": {yx: true}

    }, {
        "EPSG:3043": {yx: true}

    }, {
        "EPSG:3044": {yx: true}

    }, {
        "EPSG:3045": {yx: true}

    }, {
        "EPSG:3046": {yx: true}

    }, {
        "EPSG:3047": {yx: true}

    }, {
        "EPSG:3048": {yx: true}

    }, {
        "EPSG:3049": {yx: true}

    }, {
        "EPSG:3050": {yx: true}

    }, {
        "EPSG:3051": {yx: true}

    }, {
        "EPSG:3058": {yx: true}

    }, {
        "EPSG:3059": {yx: true}

    }, {
        "EPSG:3068": {yx: true}

    }, {
        "EPSG:3114": {yx: true}

    }, {
        "EPSG:3115": {yx: true}

    }, {
        "EPSG:3116": {yx: true}

    }, {
        "EPSG:3117": {yx: true}

    }, {
        "EPSG:3118": {yx: true}

    }, {
        "EPSG:3120": {yx: true}

    }, {
        "EPSG:3126": {yx: true}

    }, {
        "EPSG:3127": {yx: true}

    }, {
        "EPSG:3128": {yx: true}

    }, {
        "EPSG:3129": {yx: true}

    }, {
        "EPSG:3130": {yx: true}

    }, {
        "EPSG:3131": {yx: true}

    }, {
        "EPSG:3132": {yx: true}

    }, {
        "EPSG:3133": {yx: true}

    }, {
        "EPSG:3134": {yx: true}

    }, {
        "EPSG:3135": {yx: true}

    }, {
        "EPSG:3136": {yx: true}

    }, {
        "EPSG:3137": {yx: true}

    }, {
        "EPSG:3138": {yx: true}

    }, {
        "EPSG:3139": {yx: true}

    }, {
        "EPSG:3140": {yx: true}

    }, {
        "EPSG:3146": {yx: true}

    }, {
        "EPSG:3147": {yx: true}

    }, {
        "EPSG:3150": {yx: true}

    }, {
        "EPSG:3151": {yx: true}

    }, {
        "EPSG:3152": {yx: true}

    }, {
        "EPSG:3300": {yx: true}

    }, {
        "EPSG:3301": {yx: true}

    }, {
        "EPSG:3328": {yx: true}

    }, {
        "EPSG:3329": {yx: true}

    }, {
        "EPSG:3330": {yx: true}

    }, {
        "EPSG:3331": {yx: true}

    }, {
        "EPSG:3332": {yx: true}

    }, {
        "EPSG:3333": {yx: true}

    }, {
        "EPSG:3334": {yx: true}

    }, {
        "EPSG:3335": {yx: true}

    }, {
        "EPSG:3346": {yx: true}

    }, {
        "EPSG:3350": {yx: true}

    }, {
        "EPSG:3351": {yx: true}

    }, {
        "EPSG:3352": {yx: true}

    }, {
        "EPSG:3366": {yx: true}

    }, {
        "EPSG:3386": {yx: true}

    }, {
        "EPSG:3387": {yx: true}

    }, {
        "EPSG:3388": {yx: true}

    }, {
        "EPSG:3389": {yx: true}

    }, {
        "EPSG:3390": {yx: true}

    }, {
        "EPSG:3396": {yx: true}

    }, {
        "EPSG:3397": {yx: true}

    }, {
        "EPSG:3398": {yx: true}

    }, {
        "EPSG:3399": {yx: true}

    }, {
        "EPSG:3407": {yx: true}

    }, {
        "EPSG:3414": {yx: true}

    }, {
        "EPSG:3416": {yx: true}

    }, {
        "EPSG:3764": {yx: true}

    }, {
        "EPSG:3788": {yx: true}

    }, {
        "EPSG:3789": {yx: true}

    }, {
        "EPSG:3790": {yx: true}

    }, {
        "EPSG:3791": {yx: true}

    }, {
        "EPSG:3793": {yx: true}

    }, {
        "EPSG:3795": {yx: true}

    }, {
        "EPSG:3796": {yx: true}

    }, {
        "EPSG:3819": {yx: true}

    }, {
        "EPSG:3821": {yx: true}

    }, {
        "EPSG:3823": {yx: true}

    }, {
        "EPSG:3824": {yx: true}

    }, {
        "EPSG:3833": {yx: true}

    }, {
        "EPSG:3834": {yx: true}

    }, {
        "EPSG:3835": {yx: true}

    }, {
        "EPSG:3836": {yx: true}

    }, {
        "EPSG:3837": {yx: true}

    }, {
        "EPSG:3838": {yx: true}

    }, {
        "EPSG:3839": {yx: true}

    }, {
        "EPSG:3840": {yx: true}

    }, {
        "EPSG:3841": {yx: true}

    }, {
        "EPSG:3842": {yx: true}

    }, {
        "EPSG:3843": {yx: true}

    }, {
        "EPSG:3844": {yx: true}

    }, {
        "EPSG:3845": {yx: true}

    }, {
        "EPSG:3846": {yx: true}

    }, {
        "EPSG:3847": {yx: true}

    }, {
        "EPSG:3848": {yx: true}

    }, {
        "EPSG:3849": {yx: true}

    }, {
        "EPSG:3850": {yx: true}

    }, {
        "EPSG:3851": {yx: true}

    }, {
        "EPSG:3852": {yx: true}

    }, {
        "EPSG:3854": {yx: true}

    }, {
        "EPSG:3873": {yx: true}

    }, {
        "EPSG:3874": {yx: true}

    }, {
        "EPSG:3875": {yx: true}

    }, {
        "EPSG:3876": {yx: true}

    }, {
        "EPSG:3877": {yx: true}

    }, {
        "EPSG:3878": {yx: true}

    }, {
        "EPSG:3879": {yx: true}

    }, {
        "EPSG:3880": {yx: true}

    }, {
        "EPSG:3881": {yx: true}

    }, {
        "EPSG:3882": {yx: true}

    }, {
        "EPSG:3883": {yx: true}

    }, {
        "EPSG:3884": {yx: true}

    }, {
        "EPSG:3885": {yx: true}

    }, {
        "EPSG:3888": {yx: true}

    }, {
        "EPSG:3889": {yx: true}

    }, {
        "EPSG:3906": {yx: true}

    }, {
        "EPSG:3907": {yx: true}

    }, {
        "EPSG:3908": {yx: true}

    }, {
        "EPSG:3909": {yx: true}

    }, {
        "EPSG:3910": {yx: true}

    }, {
        "EPSG:3911": {yx: true}

    }, {
        "EPSG:4001": {yx: true}

    }, {
        "EPSG:4002": {yx: true}

    }, {
        "EPSG:4003": {yx: true}

    }, {
        "EPSG:4004": {yx: true}

    }, {
        "EPSG:4005": {yx: true}

    }, {
        "EPSG:4006": {yx: true}

    }, {
        "EPSG:4007": {yx: true}

    }, {
        "EPSG:4008": {yx: true}

    }, {
        "EPSG:4009": {yx: true}

    }, {
        "EPSG:4010": {yx: true}

    }, {
        "EPSG:4011": {yx: true}

    }, {
        "EPSG:4012": {yx: true}

    }, {
        "EPSG:4013": {yx: true}

    }, {
        "EPSG:4014": {yx: true}

    }, {
        "EPSG:4015": {yx: true}

    }, {
        "EPSG:4016": {yx: true}

    }, {
        "EPSG:4017": {yx: true}

    }, {
        "EPSG:4018": {yx: true}

    }, {
        "EPSG:4019": {yx: true}

    }, {
        "EPSG:4020": {yx: true}

    }, {
        "EPSG:4021": {yx: true}

    }, {
        "EPSG:4022": {yx: true}

    }, {
        "EPSG:4023": {yx: true}

    }, {
        "EPSG:4024": {yx: true}

    }, {
        "EPSG:4025": {yx: true}

    }, {
        "EPSG:4026": {yx: true}

    }, {
        "EPSG:4027": {yx: true}

    }, {
        "EPSG:4028": {yx: true}

    }, {
        "EPSG:4029": {yx: true}

    }, {
        "EPSG:4030": {yx: true}

    }, {
        "EPSG:4031": {yx: true}

    }, {
        "EPSG:4032": {yx: true}

    }, {
        "EPSG:4033": {yx: true}

    }, {
        "EPSG:4034": {yx: true}

    }, {
        "EPSG:4035": {yx: true}

    }, {
        "EPSG:4036": {yx: true}

    }, {
        "EPSG:4037": {yx: true}

    }, {
        "EPSG:4038": {yx: true}

    }, {
        "EPSG:4040": {yx: true}

    }, {
        "EPSG:4041": {yx: true}

    }, {
        "EPSG:4042": {yx: true}

    }, {
        "EPSG:4043": {yx: true}

    }, {
        "EPSG:4044": {yx: true}

    }, {
        "EPSG:4045": {yx: true}

    }, {
        "EPSG:4046": {yx: true}

    }, {
        "EPSG:4047": {yx: true}

    }, {
        "EPSG:4052": {yx: true}

    }, {
        "EPSG:4053": {yx: true}

    }, {
        "EPSG:4054": {yx: true}

    }, {
        "EPSG:4055": {yx: true}

    }, {
        "EPSG:4074": {yx: true}

    }, {
        "EPSG:4075": {yx: true}

    }, {
        "EPSG:4080": {yx: true}

    }, {
        "EPSG:4081": {yx: true}

    }, {
        "EPSG:4120": {yx: true}

    }, {
        "EPSG:4121": {yx: true}

    }, {
        "EPSG:4122": {yx: true}

    }, {
        "EPSG:4123": {yx: true}

    }, {
        "EPSG:4124": {yx: true}

    }, {
        "EPSG:4125": {yx: true}

    }, {
        "EPSG:4126": {yx: true}

    }, {
        "EPSG:4127": {yx: true}

    }, {
        "EPSG:4128": {yx: true}

    }, {
        "EPSG:4129": {yx: true}

    }, {
        "EPSG:4130": {yx: true}

    }, {
        "EPSG:4131": {yx: true}

    }, {
        "EPSG:4132": {yx: true}

    }, {
        "EPSG:4133": {yx: true}

    }, {
        "EPSG:4134": {yx: true}

    }, {
        "EPSG:4135": {yx: true}

    }, {
        "EPSG:4136": {yx: true}

    }, {
        "EPSG:4137": {yx: true}

    }, {
        "EPSG:4138": {yx: true}

    }, {
        "EPSG:4139": {yx: true}

    }, {
        "EPSG:4140": {yx: true}

    }, {
        "EPSG:4141": {yx: true}

    }, {
        "EPSG:4142": {yx: true}

    }, {
        "EPSG:4143": {yx: true}

    }, {
        "EPSG:4144": {yx: true}

    }, {
        "EPSG:4145": {yx: true}

    }, {
        "EPSG:4146": {yx: true}

    }, {
        "EPSG:4147": {yx: true}

    }, {
        "EPSG:4148": {yx: true}

    }, {
        "EPSG:4149": {yx: true}

    }, {
        "EPSG:4150": {yx: true}

    }, {
        "EPSG:4151": {yx: true}

    }, {
        "EPSG:4152": {yx: true}

    }, {
        "EPSG:4153": {yx: true}

    }, {
        "EPSG:4154": {yx: true}

    }, {
        "EPSG:4155": {yx: true}

    }, {
        "EPSG:4156": {yx: true}

    }, {
        "EPSG:4157": {yx: true}

    }, {
        "EPSG:4158": {yx: true}

    }, {
        "EPSG:4159": {yx: true}

    }, {
        "EPSG:4160": {yx: true}

    }, {
        "EPSG:4161": {yx: true}

    }, {
        "EPSG:4162": {yx: true}

    }, {
        "EPSG:4163": {yx: true}

    }, {
        "EPSG:4164": {yx: true}

    }, {
        "EPSG:4165": {yx: true}

    }, {
        "EPSG:4166": {yx: true}

    }, {
        "EPSG:4167": {yx: true}

    }, {
        "EPSG:4168": {yx: true}

    }, {
        "EPSG:4169": {yx: true}

    }, {
        "EPSG:4170": {yx: true}

    }, {
        "EPSG:4171": {yx: true}

    }, {
        "EPSG:4172": {yx: true}

    }, {
        "EPSG:4173": {yx: true}

    }, {
        "EPSG:4174": {yx: true}

    }, {
        "EPSG:4175": {yx: true}

    }, {
        "EPSG:4176": {yx: true}

    }, {
        "EPSG:4178": {yx: true}

    }, {
        "EPSG:4179": {yx: true}

    }, {
        "EPSG:4180": {yx: true}

    }, {
        "EPSG:4181": {yx: true}

    }, {
        "EPSG:4182": {yx: true}

    }, {
        "EPSG:4183": {yx: true}

    }, {
        "EPSG:4184": {yx: true}

    }, {
        "EPSG:4185": {yx: true}

    }, {
        "EPSG:4188": {yx: true}

    }, {
        "EPSG:4189": {yx: true}

    }, {
        "EPSG:4190": {yx: true}

    }, {
        "EPSG:4191": {yx: true}

    }, {
        "EPSG:4192": {yx: true}

    }, {
        "EPSG:4193": {yx: true}

    }, {
        "EPSG:4194": {yx: true}

    }, {
        "EPSG:4195": {yx: true}

    }, {
        "EPSG:4196": {yx: true}

    }, {
        "EPSG:4197": {yx: true}

    }, {
        "EPSG:4198": {yx: true}

    }, {
        "EPSG:4199": {yx: true}

    }, {
        "EPSG:4200": {yx: true}

    }, {
        "EPSG:4201": {yx: true}

    }, {
        "EPSG:4202": {yx: true}

    }, {
        "EPSG:4203": {yx: true}

    }, {
        "EPSG:4204": {yx: true}

    }, {
        "EPSG:4205": {yx: true}

    }, {
        "EPSG:4206": {yx: true}

    }, {
        "EPSG:4207": {yx: true}

    }, {
        "EPSG:4208": {yx: true}

    }, {
        "EPSG:4209": {yx: true}

    }, {
        "EPSG:4210": {yx: true}

    }, {
        "EPSG:4211": {yx: true}

    }, {
        "EPSG:4212": {yx: true}

    }, {
        "EPSG:4213": {yx: true}

    }, {
        "EPSG:4214": {yx: true}

    }, {
        "EPSG:4215": {yx: true}

    }, {
        "EPSG:4216": {yx: true}

    }, {
        "EPSG:4218": {yx: true}

    }, {
        "EPSG:4219": {yx: true}

    }, {
        "EPSG:4220": {yx: true}

    }, {
        "EPSG:4221": {yx: true}

    }, {
        "EPSG:4222": {yx: true}

    }, {
        "EPSG:4223": {yx: true}

    }, {
        "EPSG:4224": {yx: true}

    }, {
        "EPSG:4225": {yx: true}

    }, {
        "EPSG:4226": {yx: true}

    }, {
        "EPSG:4227": {yx: true}

    }, {
        "EPSG:4228": {yx: true}

    }, {
        "EPSG:4229": {yx: true}

    }, {
        "EPSG:4230": {yx: true}

    }, {
        "EPSG:4231": {yx: true}

    }, {
        "EPSG:4232": {yx: true}

    }, {
        "EPSG:4233": {yx: true}

    }, {
        "EPSG:4234": {yx: true}

    }, {
        "EPSG:4235": {yx: true}

    }, {
        "EPSG:4236": {yx: true}

    }, {
        "EPSG:4237": {yx: true}

    }, {
        "EPSG:4238": {yx: true}

    }, {
        "EPSG:4239": {yx: true}

    }, {
        "EPSG:4240": {yx: true}

    }, {
        "EPSG:4241": {yx: true}

    }, {
        "EPSG:4242": {yx: true}

    }, {
        "EPSG:4243": {yx: true}

    }, {
        "EPSG:4244": {yx: true}

    }, {
        "EPSG:4245": {yx: true}

    }, {
        "EPSG:4246": {yx: true}

    }, {
        "EPSG:4247": {yx: true}

    }, {
        "EPSG:4248": {yx: true}

    }, {
        "EPSG:4249": {yx: true}

    }, {
        "EPSG:4250": {yx: true}

    }, {
        "EPSG:4251": {yx: true}

    }, {
        "EPSG:4252": {yx: true}

    }, {
        "EPSG:4253": {yx: true}

    }, {
        "EPSG:4254": {yx: true}

    }, {
        "EPSG:4255": {yx: true}

    }, {
        "EPSG:4256": {yx: true}

    }, {
        "EPSG:4257": {yx: true}

    }, {
        "EPSG:4258": {yx: true}

    }, {
        "EPSG:4259": {yx: true}

    }, {
        "EPSG:4260": {yx: true}

    }, {
        "EPSG:4261": {yx: true}

    }, {
        "EPSG:4262": {yx: true}

    }, {
        "EPSG:4263": {yx: true}

    }, {
        "EPSG:4264": {yx: true}

    }, {
        "EPSG:4265": {yx: true}

    }, {
        "EPSG:4266": {yx: true}

    }, {
        "EPSG:4267": {yx: true}

    }, {
        "EPSG:4268": {yx: true}

    }, {
        "EPSG:4269": {yx: true}

    }, {
        "EPSG:4270": {yx: true}

    }, {
        "EPSG:4271": {yx: true}

    }, {
        "EPSG:4272": {yx: true}

    }, {
        "EPSG:4273": {yx: true}

    }, {
        "EPSG:4274": {yx: true}

    }, {
        "EPSG:4275": {yx: true}

    }, {
        "EPSG:4276": {yx: true}

    }, {
        "EPSG:4277": {yx: true}

    }, {
        "EPSG:4278": {yx: true}

    }, {
        "EPSG:4279": {yx: true}

    }, {
        "EPSG:4280": {yx: true}

    }, {
        "EPSG:4281": {yx: true}

    }, {
        "EPSG:4282": {yx: true}

    }, {
        "EPSG:4283": {yx: true}

    }, {
        "EPSG:4284": {yx: true}

    }, {
        "EPSG:4285": {yx: true}

    }, {
        "EPSG:4286": {yx: true}

    }, {
        "EPSG:4287": {yx: true}

    }, {
        "EPSG:4288": {yx: true}

    }, {
        "EPSG:4289": {yx: true}

    }, {
        "EPSG:4291": {yx: true}

    }, {
        "EPSG:4292": {yx: true}

    }, {
        "EPSG:4293": {yx: true}

    }, {
        "EPSG:4294": {yx: true}

    }, {
        "EPSG:4295": {yx: true}

    }, {
        "EPSG:4296": {yx: true}

    }, {
        "EPSG:4297": {yx: true}

    }, {
        "EPSG:4298": {yx: true}

    }, {
        "EPSG:4299": {yx: true}

    }, {
        "EPSG:4300": {yx: true}

    }, {
        "EPSG:4301": {yx: true}

    }, {
        "EPSG:4302": {yx: true}

    }, {
        "EPSG:4303": {yx: true}

    }, {
        "EPSG:4304": {yx: true}

    }, {
        "EPSG:4306": {yx: true}

    }, {
        "EPSG:4307": {yx: true}

    }, {
        "EPSG:4308": {yx: true}

    }, {
        "EPSG:4309": {yx: true}

    }, {
        "EPSG:4310": {yx: true}

    }, {
        "EPSG:4311": {yx: true}

    }, {
        "EPSG:4312": {yx: true}

    }, {
        "EPSG:4313": {yx: true}

    }, {
        "EPSG:4314": {yx: true}

    }, {
        "EPSG:4315": {yx: true}

    }, {
        "EPSG:4316": {yx: true}

    }, {
        "EPSG:4317": {yx: true}

    }, {
        "EPSG:4318": {yx: true}

    }, {
        "EPSG:4319": {yx: true}

    }, {
        "EPSG:4322": {yx: true}

    }, {
        "EPSG:4324": {yx: true}

    }, {
        "EPSG:4326": {yx: true}

    }, {
        "EPSG:4327": {yx: true}

    }, {
        "EPSG:4329": {yx: true}

    }, {
        "EPSG:4339": {yx: true}

    }, {
        "EPSG:4341": {yx: true}

    }, {
        "EPSG:4343": {yx: true}

    }, {
        "EPSG:4345": {yx: true}

    }, {
        "EPSG:4347": {yx: true}

    }, {
        "EPSG:4349": {yx: true}

    }, {
        "EPSG:4351": {yx: true}

    }, {
        "EPSG:4353": {yx: true}

    }, {
        "EPSG:4355": {yx: true}

    }, {
        "EPSG:4357": {yx: true}

    }, {
        "EPSG:4359": {yx: true}

    }, {
        "EPSG:4361": {yx: true}

    }, {
        "EPSG:4363": {yx: true}

    }, {
        "EPSG:4365": {yx: true}

    }, {
        "EPSG:4367": {yx: true}

    }, {
        "EPSG:4369": {yx: true}

    }, {
        "EPSG:4371": {yx: true}

    }, {
        "EPSG:4373": {yx: true}

    }, {
        "EPSG:4375": {yx: true}

    }, {
        "EPSG:4377": {yx: true}

    }, {
        "EPSG:4379": {yx: true}

    }, {
        "EPSG:4381": {yx: true}

    }, {
        "EPSG:4383": {yx: true}

    }, {
        "EPSG:4386": {yx: true}

    }, {
        "EPSG:4388": {yx: true}

    }, {
        "EPSG:4417": {yx: true}

    }, {
        "EPSG:4434": {yx: true}

    }, {
        "EPSG:4463": {yx: true}

    }, {
        "EPSG:4466": {yx: true}

    }, {
        "EPSG:4469": {yx: true}

    }, {
        "EPSG:4470": {yx: true}

    }, {
        "EPSG:4472": {yx: true}

    }, {
        "EPSG:4475": {yx: true}

    }, {
        "EPSG:4480": {yx: true}

    }, {
        "EPSG:4482": {yx: true}

    }, {
        "EPSG:4483": {yx: true}

    }, {
        "EPSG:4490": {yx: true}

    }, {
        "EPSG:4491": {yx: true}

    }, {
        "EPSG:4492": {yx: true}

    }, {
        "EPSG:4493": {yx: true}

    }, {
        "EPSG:4494": {yx: true}

    }, {
        "EPSG:4495": {yx: true}

    }, {
        "EPSG:4496": {yx: true}

    }, {
        "EPSG:4497": {yx: true}

    }, {
        "EPSG:4498": {yx: true}

    }, {
        "EPSG:4499": {yx: true}

    }, {
        "EPSG:4500": {yx: true}

    }, {
        "EPSG:4501": {yx: true}

    }, {
        "EPSG:4502": {yx: true}

    }, {
        "EPSG:4503": {yx: true}

    }, {
        "EPSG:4504": {yx: true}

    }, {
        "EPSG:4505": {yx: true}

    }, {
        "EPSG:4506": {yx: true}

    }, {
        "EPSG:4507": {yx: true}

    }, {
        "EPSG:4508": {yx: true}

    }, {
        "EPSG:4509": {yx: true}

    }, {
        "EPSG:4510": {yx: true}

    }, {
        "EPSG:4511": {yx: true}

    }, {
        "EPSG:4512": {yx: true}

    }, {
        "EPSG:4513": {yx: true}

    }, {
        "EPSG:4514": {yx: true}

    }, {
        "EPSG:4515": {yx: true}

    }, {
        "EPSG:4516": {yx: true}

    }, {
        "EPSG:4517": {yx: true}

    }, {
        "EPSG:4518": {yx: true}

    }, {
        "EPSG:4519": {yx: true}

    }, {
        "EPSG:4520": {yx: true}

    }, {
        "EPSG:4521": {yx: true}

    }, {
        "EPSG:4522": {yx: true}

    }, {
        "EPSG:4523": {yx: true}

    }, {
        "EPSG:4524": {yx: true}

    }, {
        "EPSG:4525": {yx: true}

    }, {
        "EPSG:4526": {yx: true}

    }, {
        "EPSG:4527": {yx: true}

    }, {
        "EPSG:4528": {yx: true}

    }, {
        "EPSG:4529": {yx: true}

    }, {
        "EPSG:4530": {yx: true}

    }, {
        "EPSG:4531": {yx: true}

    }, {
        "EPSG:4532": {yx: true}

    }, {
        "EPSG:4533": {yx: true}

    }, {
        "EPSG:4534": {yx: true}

    }, {
        "EPSG:4535": {yx: true}

    }, {
        "EPSG:4536": {yx: true}

    }, {
        "EPSG:4537": {yx: true}

    }, {
        "EPSG:4538": {yx: true}

    }, {
        "EPSG:4539": {yx: true}

    }, {
        "EPSG:4540": {yx: true}

    }, {
        "EPSG:4541": {yx: true}

    }, {
        "EPSG:4542": {yx: true}

    }, {
        "EPSG:4543": {yx: true}

    }, {
        "EPSG:4544": {yx: true}

    }, {
        "EPSG:4545": {yx: true}

    }, {
        "EPSG:4546": {yx: true}

    }, {
        "EPSG:4547": {yx: true}

    }, {
        "EPSG:4548": {yx: true}

    }, {
        "EPSG:4549": {yx: true}

    }, {
        "EPSG:4550": {yx: true}

    }, {
        "EPSG:4551": {yx: true}

    }, {
        "EPSG:4552": {yx: true}

    }, {
        "EPSG:4553": {yx: true}

    }, {
        "EPSG:4554": {yx: true}

    }, {
        "EPSG:4555": {yx: true}

    }, {
        "EPSG:4557": {yx: true}

    }, {
        "EPSG:4558": {yx: true}

    }, {
        "EPSG:4568": {yx: true}

    }, {
        "EPSG:4569": {yx: true}

    }, {
        "EPSG:4570": {yx: true}

    }, {
        "EPSG:4571": {yx: true}

    }, {
        "EPSG:4572": {yx: true}

    }, {
        "EPSG:4573": {yx: true}

    }, {
        "EPSG:4574": {yx: true}

    }, {
        "EPSG:4575": {yx: true}

    }, {
        "EPSG:4576": {yx: true}

    }, {
        "EPSG:4577": {yx: true}

    }, {
        "EPSG:4578": {yx: true}

    }, {
        "EPSG:4579": {yx: true}

    }, {
        "EPSG:4580": {yx: true}

    }, {
        "EPSG:4581": {yx: true}

    }, {
        "EPSG:4582": {yx: true}

    }, {
        "EPSG:4583": {yx: true}

    }, {
        "EPSG:4584": {yx: true}

    }, {
        "EPSG:4585": {yx: true}

    }, {
        "EPSG:4586": {yx: true}

    }, {
        "EPSG:4587": {yx: true}

    }, {
        "EPSG:4588": {yx: true}

    }, {
        "EPSG:4589": {yx: true}

    }, {
        "EPSG:4600": {yx: true}

    }, {
        "EPSG:4601": {yx: true}

    }, {
        "EPSG:4602": {yx: true}

    }, {
        "EPSG:4603": {yx: true}

    }, {
        "EPSG:4604": {yx: true}

    }, {
        "EPSG:4605": {yx: true}

    }, {
        "EPSG:4606": {yx: true}

    }, {
        "EPSG:4607": {yx: true}

    }, {
        "EPSG:4608": {yx: true}

    }, {
        "EPSG:4609": {yx: true}

    }, {
        "EPSG:4610": {yx: true}

    }, {
        "EPSG:4611": {yx: true}

    }, {
        "EPSG:4612": {yx: true}

    }, {
        "EPSG:4613": {yx: true}

    }, {
        "EPSG:4614": {yx: true}

    }, {
        "EPSG:4615": {yx: true}

    }, {
        "EPSG:4616": {yx: true}

    }, {
        "EPSG:4617": {yx: true}

    }, {
        "EPSG:4618": {yx: true}

    }, {
        "EPSG:4619": {yx: true}

    }, {
        "EPSG:4620": {yx: true}

    }, {
        "EPSG:4621": {yx: true}

    }, {
        "EPSG:4622": {yx: true}

    }, {
        "EPSG:4623": {yx: true}

    }, {
        "EPSG:4624": {yx: true}

    }, {
        "EPSG:4625": {yx: true}

    }, {
        "EPSG:4626": {yx: true}

    }, {
        "EPSG:4627": {yx: true}

    }, {
        "EPSG:4628": {yx: true}

    }, {
        "EPSG:4629": {yx: true}

    }, {
        "EPSG:4630": {yx: true}

    }, {
        "EPSG:4631": {yx: true}

    }, {
        "EPSG:4632": {yx: true}

    }, {
        "EPSG:4633": {yx: true}

    }, {
        "EPSG:4634": {yx: true}

    }, {
        "EPSG:4635": {yx: true}

    }, {
        "EPSG:4636": {yx: true}

    }, {
        "EPSG:4637": {yx: true}

    }, {
        "EPSG:4638": {yx: true}

    }, {
        "EPSG:4639": {yx: true}

    }, {
        "EPSG:4640": {yx: true}

    }, {
        "EPSG:4641": {yx: true}

    }, {
        "EPSG:4642": {yx: true}

    }, {
        "EPSG:4643": {yx: true}

    }, {
        "EPSG:4644": {yx: true}

    }, {
        "EPSG:4645": {yx: true}

    }, {
        "EPSG:4646": {yx: true}

    }, {
        "EPSG:4652": {yx: true}

    }, {
        "EPSG:4653": {yx: true}

    }, {
        "EPSG:4654": {yx: true}

    }, {
        "EPSG:4655": {yx: true}

    }, {
        "EPSG:4656": {yx: true}

    }, {
        "EPSG:4657": {yx: true}

    }, {
        "EPSG:4658": {yx: true}

    }, {
        "EPSG:4659": {yx: true}

    }, {
        "EPSG:4660": {yx: true}

    }, {
        "EPSG:4661": {yx: true}

    }, {
        "EPSG:4662": {yx: true}

    }, {
        "EPSG:4663": {yx: true}

    }, {
        "EPSG:4664": {yx: true}

    }, {
        "EPSG:4665": {yx: true}

    }, {
        "EPSG:4666": {yx: true}

    }, {
        "EPSG:4667": {yx: true}

    }, {
        "EPSG:4668": {yx: true}

    }, {
        "EPSG:4669": {yx: true}

    }, {
        "EPSG:4670": {yx: true}

    }, {
        "EPSG:4671": {yx: true}

    }, {
        "EPSG:4672": {yx: true}

    }, {
        "EPSG:4673": {yx: true}

    }, {
        "EPSG:4674": {yx: true}

    }, {
        "EPSG:4675": {yx: true}

    }, {
        "EPSG:4676": {yx: true}

    }, {
        "EPSG:4677": {yx: true}

    }, {
        "EPSG:4678": {yx: true}

    }, {
        "EPSG:4679": {yx: true}

    }, {
        "EPSG:4680": {yx: true}

    }, {
        "EPSG:4681": {yx: true}

    }, {
        "EPSG:4682": {yx: true}

    }, {
        "EPSG:4683": {yx: true}

    }, {
        "EPSG:4684": {yx: true}

    }, {
        "EPSG:4685": {yx: true}

    }, {
        "EPSG:4686": {yx: true}

    }, {
        "EPSG:4687": {yx: true}

    }, {
        "EPSG:4688": {yx: true}

    }, {
        "EPSG:4689": {yx: true}

    }, {
        "EPSG:4690": {yx: true}

    }, {
        "EPSG:4691": {yx: true}

    }, {
        "EPSG:4692": {yx: true}

    }, {
        "EPSG:4693": {yx: true}

    }, {
        "EPSG:4694": {yx: true}

    }, {
        "EPSG:4695": {yx: true}

    }, {
        "EPSG:4696": {yx: true}

    }, {
        "EPSG:4697": {yx: true}

    }, {
        "EPSG:4698": {yx: true}

    }, {
        "EPSG:4699": {yx: true}

    }, {
        "EPSG:4700": {yx: true}

    }, {
        "EPSG:4701": {yx: true}

    }, {
        "EPSG:4702": {yx: true}

    }, {
        "EPSG:4703": {yx: true}

    }, {
        "EPSG:4704": {yx: true}

    }, {
        "EPSG:4705": {yx: true}

    }, {
        "EPSG:4706": {yx: true}

    }, {
        "EPSG:4707": {yx: true}

    }, {
        "EPSG:4708": {yx: true}

    }, {
        "EPSG:4709": {yx: true}

    }, {
        "EPSG:4710": {yx: true}

    }, {
        "EPSG:4711": {yx: true}

    }, {
        "EPSG:4712": {yx: true}

    }, {
        "EPSG:4713": {yx: true}

    }, {
        "EPSG:4714": {yx: true}

    }, {
        "EPSG:4715": {yx: true}

    }, {
        "EPSG:4716": {yx: true}

    }, {
        "EPSG:4717": {yx: true}

    }, {
        "EPSG:4718": {yx: true}

    }, {
        "EPSG:4719": {yx: true}

    }, {
        "EPSG:4720": {yx: true}

    }, {
        "EPSG:4721": {yx: true}

    }, {
        "EPSG:4722": {yx: true}

    }, {
        "EPSG:4723": {yx: true}

    }, {
        "EPSG:4724": {yx: true}

    }, {
        "EPSG:4725": {yx: true}

    }, {
        "EPSG:4726": {yx: true}

    }, {
        "EPSG:4727": {yx: true}

    }, {
        "EPSG:4728": {yx: true}

    }, {
        "EPSG:4729": {yx: true}

    }, {
        "EPSG:4730": {yx: true}

    }, {
        "EPSG:4731": {yx: true}

    }, {
        "EPSG:4732": {yx: true}

    }, {
        "EPSG:4733": {yx: true}

    }, {
        "EPSG:4734": {yx: true}

    }, {
        "EPSG:4735": {yx: true}

    }, {
        "EPSG:4736": {yx: true}

    }, {
        "EPSG:4737": {yx: true}

    }, {
        "EPSG:4738": {yx: true}

    }, {
        "EPSG:4739": {yx: true}

    }, {
        "EPSG:4740": {yx: true}

    }, {
        "EPSG:4741": {yx: true}

    }, {
        "EPSG:4742": {yx: true}

    }, {
        "EPSG:4743": {yx: true}

    }, {
        "EPSG:4744": {yx: true}

    }, {
        "EPSG:4745": {yx: true}

    }, {
        "EPSG:4746": {yx: true}

    }, {
        "EPSG:4747": {yx: true}

    }, {
        "EPSG:4748": {yx: true}

    }, {
        "EPSG:4749": {yx: true}

    }, {
        "EPSG:4750": {yx: true}

    }, {
        "EPSG:4751": {yx: true}

    }, {
        "EPSG:4752": {yx: true}

    }, {
        "EPSG:4753": {yx: true}

    }, {
        "EPSG:4754": {yx: true}

    }, {
        "EPSG:4755": {yx: true}

    }, {
        "EPSG:4756": {yx: true}

    }, {
        "EPSG:4757": {yx: true}

    }, {
        "EPSG:4758": {yx: true}

    }, {
        "EPSG:4759": {yx: true}

    }, {
        "EPSG:4760": {yx: true}

    }, {
        "EPSG:4761": {yx: true}

    }, {
        "EPSG:4762": {yx: true}

    }, {
        "EPSG:4763": {yx: true}

    }, {
        "EPSG:4764": {yx: true}

    }, {
        "EPSG:4765": {yx: true}

    }, {
        "EPSG:4766": {yx: true}

    }, {
        "EPSG:4767": {yx: true}

    }, {
        "EPSG:4768": {yx: true}

    }, {
        "EPSG:4769": {yx: true}

    }, {
        "EPSG:4770": {yx: true}

    }, {
        "EPSG:4771": {yx: true}

    }, {
        "EPSG:4772": {yx: true}

    }, {
        "EPSG:4773": {yx: true}

    }, {
        "EPSG:4774": {yx: true}

    }, {
        "EPSG:4775": {yx: true}

    }, {
        "EPSG:4776": {yx: true}

    }, {
        "EPSG:4777": {yx: true}

    }, {
        "EPSG:4778": {yx: true}

    }, {
        "EPSG:4779": {yx: true}

    }, {
        "EPSG:4780": {yx: true}

    }, {
        "EPSG:4781": {yx: true}

    }, {
        "EPSG:4782": {yx: true}

    }, {
        "EPSG:4783": {yx: true}

    }, {
        "EPSG:4784": {yx: true}

    }, {
        "EPSG:4785": {yx: true}

    }, {
        "EPSG:4786": {yx: true}

    }, {
        "EPSG:4787": {yx: true}

    }, {
        "EPSG:4788": {yx: true}

    }, {
        "EPSG:4789": {yx: true}

    }, {
        "EPSG:4790": {yx: true}

    }, {
        "EPSG:4791": {yx: true}

    }, {
        "EPSG:4792": {yx: true}

    }, {
        "EPSG:4793": {yx: true}

    }, {
        "EPSG:4794": {yx: true}

    }, {
        "EPSG:4795": {yx: true}

    }, {
        "EPSG:4796": {yx: true}

    }, {
        "EPSG:4797": {yx: true}

    }, {
        "EPSG:4798": {yx: true}

    }, {
        "EPSG:4799": {yx: true}

    }, {
        "EPSG:4800": {yx: true}

    }, {
        "EPSG:4801": {yx: true}

    }, {
        "EPSG:4802": {yx: true}

    }, {
        "EPSG:4803": {yx: true}

    }, {
        "EPSG:4804": {yx: true}

    }, {
        "EPSG:4805": {yx: true}

    }, {
        "EPSG:4806": {yx: true}

    }, {
        "EPSG:4807": {yx: true}

    }, {
        "EPSG:4808": {yx: true}

    }, {
        "EPSG:4809": {yx: true}

    }, {
        "EPSG:4810": {yx: true}

    }, {
        "EPSG:4811": {yx: true}

    }, {
        "EPSG:4812": {yx: true}

    }, {
        "EPSG:4813": {yx: true}

    }, {
        "EPSG:4814": {yx: true}

    }, {
        "EPSG:4815": {yx: true}

    }, {
        "EPSG:4816": {yx: true}

    }, {
        "EPSG:4817": {yx: true}

    }, {
        "EPSG:4818": {yx: true}

    }, {
        "EPSG:4819": {yx: true}

    }, {
        "EPSG:4820": {yx: true}

    }, {
        "EPSG:4821": {yx: true}

    }, {
        "EPSG:4822": {yx: true}

    }, {
        "EPSG:4823": {yx: true}

    }, {
        "EPSG:4824": {yx: true}

    }, {
        "EPSG:4839": {yx: true}

    }, {
        "EPSG:4855": {yx: true}

    }, {
        "EPSG:4856": {yx: true}

    }, {
        "EPSG:4857": {yx: true}

    }, {
        "EPSG:4858": {yx: true}

    }, {
        "EPSG:4859": {yx: true}

    }, {
        "EPSG:4860": {yx: true}

    }, {
        "EPSG:4861": {yx: true}

    }, {
        "EPSG:4862": {yx: true}

    }, {
        "EPSG:4863": {yx: true}

    }, {
        "EPSG:4864": {yx: true}

    }, {
        "EPSG:4865": {yx: true}

    }, {
        "EPSG:4866": {yx: true}

    }, {
        "EPSG:4867": {yx: true}

    }, {
        "EPSG:4868": {yx: true}

    }, {
        "EPSG:4869": {yx: true}

    }, {
        "EPSG:4870": {yx: true}

    }, {
        "EPSG:4871": {yx: true}

    }, {
        "EPSG:4872": {yx: true}

    }, {
        "EPSG:4873": {yx: true}

    }, {
        "EPSG:4874": {yx: true}

    }, {
        "EPSG:4875": {yx: true}

    }, {
        "EPSG:4876": {yx: true}

    }, {
        "EPSG:4877": {yx: true}

    }, {
        "EPSG:4878": {yx: true}

    }, {
        "EPSG:4879": {yx: true}

    }, {
        "EPSG:4880": {yx: true}

    }, {
        "EPSG:4883": {yx: true}

    }, {
        "EPSG:4885": {yx: true}

    }, {
        "EPSG:4887": {yx: true}

    }, {
        "EPSG:4889": {yx: true}

    }, {
        "EPSG:4891": {yx: true}

    }, {
        "EPSG:4893": {yx: true}

    }, {
        "EPSG:4895": {yx: true}

    }, {
        "EPSG:4898": {yx: true}

    }, {
        "EPSG:4900": {yx: true}

    }, {
        "EPSG:4901": {yx: true}

    }, {
        "EPSG:4902": {yx: true}

    }, {
        "EPSG:4903": {yx: true}

    }, {
        "EPSG:4904": {yx: true}

    }, {
        "EPSG:4907": {yx: true}

    }, {
        "EPSG:4909": {yx: true}

    }, {
        "EPSG:4921": {yx: true}

    }, {
        "EPSG:4923": {yx: true}

    }, {
        "EPSG:4925": {yx: true}

    }, {
        "EPSG:4927": {yx: true}

    }, {
        "EPSG:4929": {yx: true}

    }, {
        "EPSG:4931": {yx: true}

    }, {
        "EPSG:4933": {yx: true}

    }, {
        "EPSG:4935": {yx: true}

    }, {
        "EPSG:4937": {yx: true}

    }, {
        "EPSG:4939": {yx: true}

    }, {
        "EPSG:4941": {yx: true}

    }, {
        "EPSG:4943": {yx: true}

    }, {
        "EPSG:4945": {yx: true}

    }, {
        "EPSG:4947": {yx: true}

    }, {
        "EPSG:4949": {yx: true}

    }, {
        "EPSG:4951": {yx: true}

    }, {
        "EPSG:4953": {yx: true}

    }, {
        "EPSG:4955": {yx: true}

    }, {
        "EPSG:4957": {yx: true}

    }, {
        "EPSG:4959": {yx: true}

    }, {
        "EPSG:4961": {yx: true}

    }, {
        "EPSG:4963": {yx: true}

    }, {
        "EPSG:4965": {yx: true}

    }, {
        "EPSG:4967": {yx: true}

    }, {
        "EPSG:4969": {yx: true}

    }, {
        "EPSG:4971": {yx: true}

    }, {
        "EPSG:4973": {yx: true}

    }, {
        "EPSG:4975": {yx: true}

    }, {
        "EPSG:4977": {yx: true}

    }, {
        "EPSG:4979": {yx: true}

    }, {
        "EPSG:4981": {yx: true}

    }, {
        "EPSG:4983": {yx: true}

    }, {
        "EPSG:4985": {yx: true}

    }, {
        "EPSG:4987": {yx: true}

    }, {
        "EPSG:4989": {yx: true}

    }, {
        "EPSG:4991": {yx: true}

    }, {
        "EPSG:4993": {yx: true}

    }, {
        "EPSG:4995": {yx: true}

    }, {
        "EPSG:4997": {yx: true}

    }, {
        "EPSG:4999": {yx: true}

    }, {
        "EPSG:5012": {yx: true}

    }, {
        "EPSG:5013": {yx: true}

    }, {
        "EPSG:5017": {yx: true}

    }, {
        "EPSG:5048": {yx: true}

    }, {
        "EPSG:5105": {yx: true}

    }, {
        "EPSG:5106": {yx: true}

    }, {
        "EPSG:5107": {yx: true}

    }, {
        "EPSG:5108": {yx: true}

    }, {
        "EPSG:5109": {yx: true}

    }, {
        "EPSG:5110": {yx: true}

    }, {
        "EPSG:5111": {yx: true}

    }, {
        "EPSG:5112": {yx: true}

    }, {
        "EPSG:5113": {yx: true}

    }, {
        "EPSG:5114": {yx: true}

    }, {
        "EPSG:5115": {yx: true}

    }, {
        "EPSG:5116": {yx: true}

    }, {
        "EPSG:5117": {yx: true}

    }, {
        "EPSG:5118": {yx: true}

    }, {
        "EPSG:5119": {yx: true}

    }, {
        "EPSG:5120": {yx: true}

    }, {
        "EPSG:5121": {yx: true}

    }, {
        "EPSG:5122": {yx: true}

    }, {
        "EPSG:5123": {yx: true}

    }, {
        "EPSG:5124": {yx: true}

    }, {
        "EPSG:5125": {yx: true}

    }, {
        "EPSG:5126": {yx: true}

    }, {
        "EPSG:5127": {yx: true}

    }, {
        "EPSG:5128": {yx: true}

    }, {
        "EPSG:5129": {yx: true}

    }, {
        "EPSG:5130": {yx: true}

    }, {
        "EPSG:5132": {yx: true}

    }, {
        "EPSG:5167": {yx: true}

    }, {
        "EPSG:5168": {yx: true}

    }, {
        "EPSG:5169": {yx: true}

    }, {
        "EPSG:5170": {yx: true}

    }, {
        "EPSG:5171": {yx: true}

    }, {
        "EPSG:5172": {yx: true}

    }, {
        "EPSG:5173": {yx: true}

    }, {
        "EPSG:5174": {yx: true}

    }, {
        "EPSG:5175": {yx: true}

    }, {
        "EPSG:5176": {yx: true}

    }, {
        "EPSG:5177": {yx: true}

    }, {
        "EPSG:5178": {yx: true}

    }, {
        "EPSG:5179": {yx: true}

    }, {
        "EPSG:5180": {yx: true}

    }, {
        "EPSG:5181": {yx: true}

    }, {
        "EPSG:5182": {yx: true}

    }, {
        "EPSG:5183": {yx: true}

    }, {
        "EPSG:5184": {yx: true}

    }, {
        "EPSG:5185": {yx: true}

    }, {
        "EPSG:5186": {yx: true}

    }, {
        "EPSG:5187": {yx: true}

    }, {
        "EPSG:5188": {yx: true}

    }, {
        "EPSG:5224": {yx: true}

    }, {
        "EPSG:5228": {yx: true}

    }, {
        "EPSG:5229": {yx: true}

    }, {
        "EPSG:5233": {yx: true}

    }, {
        "EPSG:5245": {yx: true}

    }, {
        "EPSG:5246": {yx: true}

    }, {
        "EPSG:5251": {yx: true}

    }, {
        "EPSG:5252": {yx: true}

    }, {
        "EPSG:5253": {yx: true}

    }, {
        "EPSG:5254": {yx: true}

    }, {
        "EPSG:5255": {yx: true}

    }, {
        "EPSG:5256": {yx: true}

    }, {
        "EPSG:5257": {yx: true}

    }, {
        "EPSG:5258": {yx: true}

    }, {
        "EPSG:5259": {yx: true}

    }, {
        "EPSG:5263": {yx: true}

    }, {
        "EPSG:5264": {yx: true}

    }, {
        "EPSG:5269": {yx: true}

    }, {
        "EPSG:5270": {yx: true}

    }, {
        "EPSG:5271": {yx: true}

    }, {
        "EPSG:5272": {yx: true}

    }, {
        "EPSG:5273": {yx: true}

    }, {
        "EPSG:5274": {yx: true}

    }, {
        "EPSG:5275": {yx: true}

    }, {
        "EPSG:5323": {yx: true}

    }, {
        "EPSG:5324": {yx: true}

    }, {
        "EPSG:5340": {yx: true}

    }, {
        "EPSG:5342": {yx: true}

    }, {
        "EPSG:5343": {yx: true}

    }, {
        "EPSG:5344": {yx: true}

    }, {
        "EPSG:5345": {yx: true}

    }, {
        "EPSG:5346": {yx: true}

    }, {
        "EPSG:5347": {yx: true}

    }, {
        "EPSG:5348": {yx: true}

    }, {
        "EPSG:5349": {yx: true}

    }, {
        "EPSG:5353": {yx: true}

    }, {
        "EPSG:5354": {yx: true}

    }, {
        "EPSG:5359": {yx: true}

    }, {
        "EPSG:5360": {yx: true}

    }, {
        "EPSG:5364": {yx: true}

    }, {
        "EPSG:5365": {yx: true}

    }, {
        "EPSG:5367": {yx: true}

    }, {
        "EPSG:5370": {yx: true}

    }, {
        "EPSG:5371": {yx: true}

    }, {
        "EPSG:5372": {yx: true}

    }, {
        "EPSG:5373": {yx: true}

    }, {
        "EPSG:5380": {yx: true}

    }, {
        "EPSG:5381": {yx: true}

    }, {
        "EPSG:5392": {yx: true}

    }, {
        "EPSG:5393": {yx: true}

    }, {
        "EPSG:5451": {yx: true}

    }, {
        "EPSG:5464": {yx: true}

    }, {
        "EPSG:5467": {yx: true}

    }, {
        "EPSG:5479": {yx: true}

    }, {
        "EPSG:5480": {yx: true}

    }, {
        "EPSG:5481": {yx: true}

    }, {
        "EPSG:5488": {yx: true}

    }, {
        "EPSG:5489": {yx: true}

    }, {
        "EPSG:5513": {yx: true}

    }, {
        "EPSG:5515": {yx: true}

    }, {
        "EPSG:5518": {yx: true}

    }, {
        "EPSG:5519": {yx: true}

    }, {
        "EPSG:5520": {yx: true}

    }, {
        "EPSG:5524": {yx: true}

    }, {
        "EPSG:5527": {yx: true}

    }, {
        "EPSG:5545": {yx: true}

    }, {
        "EPSG:5546": {yx: true}

    }, {
        "EPSG:5560": {yx: true}

    }, {
        "EPSG:5561": {yx: true}

    }, {
        "EPSG:5562": {yx: true}

    }, {
        "EPSG:5563": {yx: true}

    }, {
        "EPSG:5564": {yx: true}

    }, {
        "EPSG:5565": {yx: true}

    }, {
        "EPSG:5566": {yx: true}

    }, {
        "EPSG:5567": {yx: true}

    }, {
        "EPSG:5568": {yx: true}

    }, {
        "EPSG:5569": {yx: true}

    }, {
        "EPSG:5570": {yx: true}

    }, {
        "EPSG:5571": {yx: true}

    }, {
        "EPSG:5572": {yx: true}

    }, {
        "EPSG:5573": {yx: true}

    }, {
        "EPSG:5574": {yx: true}

    }, {
        "EPSG:5575": {yx: true}

    }, {
        "EPSG:5576": {yx: true}

    }, {
        "EPSG:5577": {yx: true}

    }, {
        "EPSG:5578": {yx: true}

    }, {
        "EPSG:5579": {yx: true}

    }, {
        "EPSG:5580": {yx: true}

    }, {
        "EPSG:5581": {yx: true}

    }, {
        "EPSG:5582": {yx: true}

    }, {
        "EPSG:5583": {yx: true}

    }, {
        "EPSG:5588": {yx: true}

    }, {
        "EPSG:5592": {yx: true}

    }, {
        "EPSG:5593": {yx: true}

    }, {
        "EPSG:5632": {yx: true}

    }, {
        "EPSG:5633": {yx: true}

    }, {
        "EPSG:5634": {yx: true}

    }, {
        "EPSG:5635": {yx: true}

    }, {
        "EPSG:5636": {yx: true}

    }, {
        "EPSG:5637": {yx: true}

    }, {
        "EPSG:5638": {yx: true}

    }, {
        "EPSG:5639": {yx: true}

    }, {
        "EPSG:5651": {yx: true}

    }, {
        "EPSG:5652": {yx: true}

    }, {
        "EPSG:5653": {yx: true}

    }, {
        "EPSG:5681": {yx: true}

    }, {
        "EPSG:5801": {yx: true}

    }, {
        "EPSG:5802": {yx: true}

    }, {
        "EPSG:5803": {yx: true}

    }, {
        "EPSG:5804": {yx: true}

    }, {
        "EPSG:5808": {yx: true}

    }, {
        "EPSG:5809": {yx: true}

    }, {
        "EPSG:5810": {yx: true}

    }, {
        "EPSG:5811": {yx: true}

    }, {
        "EPSG:5812": {yx: true}

    }, {
        "EPSG:5813": {yx: true}

    }, {
        "EPSG:5814": {yx: true}

    }, {
        "EPSG:5815": {yx: true}

    }, {
        "EPSG:5816": {yx: true}

    }, {
        "EPSG:5830": {yx: true}

    }, {
        "EPSG:5885": {yx: true}

    }, {
        "EPSG:5886": {yx: true}

    }, {
        "EPSG:6134": {yx: true}

    }, {
        "EPSG:6135": {yx: true}

    }, {
        "EPSG:6207": {yx: true}

    }, {
        "EPSG:6244": {yx: true}

    }, {
        "EPSG:6245": {yx: true}

    }, {
        "EPSG:6246": {yx: true}

    }, {
        "EPSG:6247": {yx: true}

    }, {
        "EPSG:6248": {yx: true}

    }, {
        "EPSG:6249": {yx: true}

    }, {
        "EPSG:6250": {yx: true}

    }, {
        "EPSG:6251": {yx: true}

    }, {
        "EPSG:6252": {yx: true}

    }, {
        "EPSG:6253": {yx: true}

    }, {
        "EPSG:6254": {yx: true}

    }, {
        "EPSG:6255": {yx: true}

    }, {
        "EPSG:6256": {yx: true}

    }, {
        "EPSG:6257": {yx: true}

    }, {
        "EPSG:6258": {yx: true}

    }, {
        "EPSG:6259": {yx: true}

    }, {
        "EPSG:6260": {yx: true}

    }, {
        "EPSG:6261": {yx: true}

    }, {
        "EPSG:6262": {yx: true}

    }, {
        "EPSG:6263": {yx: true}

    }, {
        "EPSG:6264": {yx: true}

    }, {
        "EPSG:6265": {yx: true}

    }, {
        "EPSG:6266": {yx: true}

    }, {
        "EPSG:6267": {yx: true}

    }, {
        "EPSG:6268": {yx: true}

    }, {
        "EPSG:6269": {yx: true}

    }, {
        "EPSG:6270": {yx: true}

    }, {
        "EPSG:6271": {yx: true}

    }, {
        "EPSG:6272": {yx: true}

    }, {
        "EPSG:6273": {yx: true}

    }, {
        "EPSG:6274": {yx: true}

    }, {
        "EPSG:6275": {yx: true}

    }, {
        "EPSG:6318": {yx: true}

    }, {
        "EPSG:6319": {yx: true}

    }, {
        "EPSG:6321": {yx: true}

    }, {
        "EPSG:6322": {yx: true}

    }, {
        "EPSG:6324": {yx: true}

    }, {
        "EPSG:6325": {yx: true}

    }, {
        "EPSG:6362": {yx: true}

    }, {
        "EPSG:6364": {yx: true}

    }, {
        "EPSG:6365": {yx: true}

    }, {
        "EPSG:6372": {yx: true}

    }, {
        "EPSG:6381": {yx: true}

    }, {
        "EPSG:6382": {yx: true}

    }, {
        "EPSG:6383": {yx: true}

    }, {
        "EPSG:6384": {yx: true}

    }, {
        "EPSG:6385": {yx: true}

    }, {
        "EPSG:6386": {yx: true}

    }, {
        "EPSG:6387": {yx: true}

    }, {
        "EPSG:6667": {yx: true}

    }, {
        "EPSG:6668": {yx: true}

    }, {
        "EPSG:6669": {yx: true}

    }, {
        "EPSG:6670": {yx: true}

    }, {
        "EPSG:6671": {yx: true}

    }, {
        "EPSG:6672": {yx: true}

    }, {
        "EPSG:6673": {yx: true}

    }, {
        "EPSG:6674": {yx: true}

    }, {
        "EPSG:6675": {yx: true}

    }, {
        "EPSG:6676": {yx: true}

    }, {
        "EPSG:6677": {yx: true}

    }, {
        "EPSG:6678": {yx: true}

    }, {
        "EPSG:6679": {yx: true}

    }, {
        "EPSG:6680": {yx: true}

    }, {
        "EPSG:6681": {yx: true}

    }, {
        "EPSG:6682": {yx: true}

    }, {
        "EPSG:6683": {yx: true}

    }, {
        "EPSG:6684": {yx: true}

    }, {
        "EPSG:6685": {yx: true}

    }, {
        "EPSG:6686": {yx: true}

    }, {
        "EPSG:6687": {yx: true}

    }, {
        "EPSG:6705": {yx: true}

    }, {
        "EPSG:6706": {yx: true}

    }, {
        "EPSG:6707": {yx: true}

    }, {
        "EPSG:6708": {yx: true}

    }, {
        "EPSG:6709": {yx: true}

    }, {
        "EPSG:6782": {yx: true}

    }, {
        "EPSG:6783": {yx: true}

    }, {
        "EPSG:6870": {yx: true}

    }, {
        "EPSG:6875": {yx: true}

    }, {
        "EPSG:6876": {yx: true}

    }, {
        "EPSG:6881": {yx: true}

    }, {
        "EPSG:6882": {yx: true}

    }, {
        "EPSG:6883": {yx: true}

    }, {
        "EPSG:6892": {yx: true}

    }, {
        "EPSG:6894": {yx: true}

    }, {
        "EPSG:6962": {yx: true}

    }, {
        "EPSG:6979": {yx: true}

    }, {
        "EPSG:6980": {yx: true}

    }, {
        "EPSG:6982": {yx: true}

    }, {
        "EPSG:6983": {yx: true}

    }, {
        "EPSG:6986": {yx: true}

    }, {
        "EPSG:6987": {yx: true}

    }, {
        "EPSG:6989": {yx: true}

    }, {
        "EPSG:6990": {yx: true}

    }, {
        "EPSG:20004": {yx: true}

    }, {
        "EPSG:20005": {yx: true}

    }, {
        "EPSG:20006": {yx: true}

    }, {
        "EPSG:20007": {yx: true}

    }, {
        "EPSG:20008": {yx: true}

    }, {
        "EPSG:20009": {yx: true}

    }, {
        "EPSG:20010": {yx: true}

    }, {
        "EPSG:20011": {yx: true}

    }, {
        "EPSG:20012": {yx: true}

    }, {
        "EPSG:20013": {yx: true}

    }, {
        "EPSG:20014": {yx: true}

    }, {
        "EPSG:20015": {yx: true}

    }, {
        "EPSG:20016": {yx: true}

    }, {
        "EPSG:20017": {yx: true}

    }, {
        "EPSG:20018": {yx: true}

    }, {
        "EPSG:20019": {yx: true}

    }, {
        "EPSG:20020": {yx: true}

    }, {
        "EPSG:20021": {yx: true}

    }, {
        "EPSG:20022": {yx: true}

    }, {
        "EPSG:20023": {yx: true}

    }, {
        "EPSG:20024": {yx: true}

    }, {
        "EPSG:20025": {yx: true}

    }, {
        "EPSG:20026": {yx: true}

    }, {
        "EPSG:20027": {yx: true}

    }, {
        "EPSG:20028": {yx: true}

    }, {
        "EPSG:20029": {yx: true}

    }, {
        "EPSG:20030": {yx: true}

    }, {
        "EPSG:20031": {yx: true}

    }, {
        "EPSG:20032": {yx: true}

    }, {
        "EPSG:20064": {yx: true}

    }, {
        "EPSG:20065": {yx: true}

    }, {
        "EPSG:20066": {yx: true}

    }, {
        "EPSG:20067": {yx: true}

    }, {
        "EPSG:20068": {yx: true}

    }, {
        "EPSG:20069": {yx: true}

    }, {
        "EPSG:20070": {yx: true}

    }, {
        "EPSG:20071": {yx: true}

    }, {
        "EPSG:20072": {yx: true}

    }, {
        "EPSG:20073": {yx: true}

    }, {
        "EPSG:20074": {yx: true}

    }, {
        "EPSG:20075": {yx: true}

    }, {
        "EPSG:20076": {yx: true}

    }, {
        "EPSG:20077": {yx: true}

    }, {
        "EPSG:20078": {yx: true}

    }, {
        "EPSG:20079": {yx: true}

    }, {
        "EPSG:20080": {yx: true}

    }, {
        "EPSG:20081": {yx: true}

    }, {
        "EPSG:20082": {yx: true}

    }, {
        "EPSG:20083": {yx: true}

    }, {
        "EPSG:20084": {yx: true}

    }, {
        "EPSG:20085": {yx: true}

    }, {
        "EPSG:20086": {yx: true}

    }, {
        "EPSG:20087": {yx: true}

    }, {
        "EPSG:20088": {yx: true}

    }, {
        "EPSG:20089": {yx: true}

    }, {
        "EPSG:20090": {yx: true}

    }, {
        "EPSG:20091": {yx: true}

    }, {
        "EPSG:20092": {yx: true}

    }, {
        "EPSG:21413": {yx: true}

    }, {
        "EPSG:21414": {yx: true}

    }, {
        "EPSG:21415": {yx: true}

    }, {
        "EPSG:21416": {yx: true}

    }, {
        "EPSG:21417": {yx: true}

    }, {
        "EPSG:21418": {yx: true}

    }, {
        "EPSG:21419": {yx: true}

    }, {
        "EPSG:21420": {yx: true}

    }, {
        "EPSG:21421": {yx: true}

    }, {
        "EPSG:21422": {yx: true}

    }, {
        "EPSG:21423": {yx: true}

    }, {
        "EPSG:21453": {yx: true}

    }, {
        "EPSG:21454": {yx: true}

    }, {
        "EPSG:21455": {yx: true}

    }, {
        "EPSG:21456": {yx: true}

    }, {
        "EPSG:21457": {yx: true}

    }, {
        "EPSG:21458": {yx: true}

    }, {
        "EPSG:21459": {yx: true}

    }, {
        "EPSG:21460": {yx: true}

    }, {
        "EPSG:21461": {yx: true}

    }, {
        "EPSG:21462": {yx: true}

    }, {
        "EPSG:21463": {yx: true}

    }, {
        "EPSG:21473": {yx: true}

    }, {
        "EPSG:21474": {yx: true}

    }, {
        "EPSG:21475": {yx: true}

    }, {
        "EPSG:21476": {yx: true}

    }, {
        "EPSG:21477": {yx: true}

    }, {
        "EPSG:21478": {yx: true}

    }, {
        "EPSG:21479": {yx: true}

    }, {
        "EPSG:21480": {yx: true}

    }, {
        "EPSG:21481": {yx: true}

    }, {
        "EPSG:21482": {yx: true}

    }, {
        "EPSG:21483": {yx: true}

    }, {
        "EPSG:21896": {yx: true}

    }, {
        "EPSG:21897": {yx: true}

    }, {
        "EPSG:21898": {yx: true}

    }, {
        "EPSG:21899": {yx: true}

    }, {
        "EPSG:22171": {yx: true}

    }, {
        "EPSG:22172": {yx: true}

    }, {
        "EPSG:22173": {yx: true}

    }, {
        "EPSG:22174": {yx: true}

    }, {
        "EPSG:22175": {yx: true}

    }, {
        "EPSG:22176": {yx: true}

    }, {
        "EPSG:22177": {yx: true}

    }, {
        "EPSG:22181": {yx: true}

    }, {
        "EPSG:22182": {yx: true}

    }, {
        "EPSG:22183": {yx: true}

    }, {
        "EPSG:22184": {yx: true}

    }, {
        "EPSG:22185": {yx: true}

    }, {
        "EPSG:22186": {yx: true}

    }, {
        "EPSG:22187": {yx: true}

    }, {
        "EPSG:22191": {yx: true}

    }, {
        "EPSG:22192": {yx: true}

    }, {
        "EPSG:22193": {yx: true}

    }, {
        "EPSG:22194": {yx: true}

    }, {
        "EPSG:22195": {yx: true}

    }, {
        "EPSG:22196": {yx: true}

    }, {
        "EPSG:22197": {yx: true}

    }, {
        "EPSG:25884": {yx: true}

    }, {
        "EPSG:27205": {yx: true}

    }, {
        "EPSG:27206": {yx: true}

    }, {
        "EPSG:27207": {yx: true}

    }, {
        "EPSG:27208": {yx: true}

    }, {
        "EPSG:27209": {yx: true}

    }, {
        "EPSG:27210": {yx: true}

    }, {
        "EPSG:27211": {yx: true}

    }, {
        "EPSG:27212": {yx: true}

    }, {
        "EPSG:27213": {yx: true}

    }, {
        "EPSG:27214": {yx: true}

    }, {
        "EPSG:27215": {yx: true}

    }, {
        "EPSG:27216": {yx: true}

    }, {
        "EPSG:27217": {yx: true}

    }, {
        "EPSG:27218": {yx: true}

    }, {
        "EPSG:27219": {yx: true}

    }, {
        "EPSG:27220": {yx: true}

    }, {
        "EPSG:27221": {yx: true}

    }, {
        "EPSG:27222": {yx: true}

    }, {
        "EPSG:27223": {yx: true}

    }, {
        "EPSG:27224": {yx: true}

    }, {
        "EPSG:27225": {yx: true}

    }, {
        "EPSG:27226": {yx: true}

    }, {
        "EPSG:27227": {yx: true}

    }, {
        "EPSG:27228": {yx: true}

    }, {
        "EPSG:27229": {yx: true}

    }, {
        "EPSG:27230": {yx: true}

    }, {
        "EPSG:27231": {yx: true}

    }, {
        "EPSG:27232": {yx: true}

    }, {
        "EPSG:27391": {yx: true}

    }, {
        "EPSG:27392": {yx: true}

    }, {
        "EPSG:27393": {yx: true}

    }, {
        "EPSG:27394": {yx: true}

    }, {
        "EPSG:27395": {yx: true}

    }, {
        "EPSG:27396": {yx: true}

    }, {
        "EPSG:27397": {yx: true}

    }, {
        "EPSG:27398": {yx: true}

    }, {
        "EPSG:27492": {yx: true}

    }, {
        "EPSG:28402": {yx: true}

    }, {
        "EPSG:28403": {yx: true}

    }, {
        "EPSG:28404": {yx: true}

    }, {
        "EPSG:28405": {yx: true}

    }, {
        "EPSG:28406": {yx: true}

    }, {
        "EPSG:28407": {yx: true}

    }, {
        "EPSG:28408": {yx: true}

    }, {
        "EPSG:28409": {yx: true}

    }, {
        "EPSG:28410": {yx: true}

    }, {
        "EPSG:28411": {yx: true}

    }, {
        "EPSG:28412": {yx: true}

    }, {
        "EPSG:28413": {yx: true}

    }, {
        "EPSG:28414": {yx: true}

    }, {
        "EPSG:28415": {yx: true}

    }, {
        "EPSG:28416": {yx: true}

    }, {
        "EPSG:28417": {yx: true}

    }, {
        "EPSG:28418": {yx: true}

    }, {
        "EPSG:28419": {yx: true}

    }, {
        "EPSG:28420": {yx: true}

    }, {
        "EPSG:28421": {yx: true}

    }, {
        "EPSG:28422": {yx: true}

    }, {
        "EPSG:28423": {yx: true}

    }, {
        "EPSG:28424": {yx: true}

    }, {
        "EPSG:28425": {yx: true}

    }, {
        "EPSG:28426": {yx: true}

    }, {
        "EPSG:28427": {yx: true}

    }, {
        "EPSG:28428": {yx: true}

    }, {
        "EPSG:28429": {yx: true}

    }, {
        "EPSG:28430": {yx: true}

    }, {
        "EPSG:28431": {yx: true}

    }, {
        "EPSG:28432": {yx: true}

    }, {
        "EPSG:28462": {yx: true}

    }, {
        "EPSG:28463": {yx: true}

    }, {
        "EPSG:28464": {yx: true}

    }, {
        "EPSG:28465": {yx: true}

    }, {
        "EPSG:28466": {yx: true}

    }, {
        "EPSG:28467": {yx: true}

    }, {
        "EPSG:28468": {yx: true}

    }, {
        "EPSG:28469": {yx: true}

    }, {
        "EPSG:28470": {yx: true}

    }, {
        "EPSG:28471": {yx: true}

    }, {
        "EPSG:28472": {yx: true}

    }, {
        "EPSG:28473": {yx: true}

    }, {
        "EPSG:28474": {yx: true}

    }, {
        "EPSG:28475": {yx: true}

    }, {
        "EPSG:28476": {yx: true}

    }, {
        "EPSG:28477": {yx: true}

    }, {
        "EPSG:28478": {yx: true}

    }, {
        "EPSG:28479": {yx: true}

    }, {
        "EPSG:28480": {yx: true}

    }, {
        "EPSG:28481": {yx: true}

    }, {
        "EPSG:28482": {yx: true}

    }, {
        "EPSG:28483": {yx: true}

    }, {
        "EPSG:28484": {yx: true}

    }, {
        "EPSG:28485": {yx: true}

    }, {
        "EPSG:28486": {yx: true}

    }, {
        "EPSG:28487": {yx: true}

    }, {
        "EPSG:28488": {yx: true}

    }, {
        "EPSG:28489": {yx: true}

    }, {
        "EPSG:28490": {yx: true}

    }, {
        "EPSG:28491": {yx: true}

    }, {
        "EPSG:28492": {yx: true}

    }, {
        "EPSG:29701": {yx: true}

    }, {
        "EPSG:29702": {yx: true}

    }, {
        "EPSG:30161": {yx: true}

    }, {
        "EPSG:30162": {yx: true}

    }, {
        "EPSG:30163": {yx: true}

    }, {
        "EPSG:30164": {yx: true}

    }, {
        "EPSG:30165": {yx: true}

    }, {
        "EPSG:30166": {yx: true}

    }, {
        "EPSG:30167": {yx: true}

    }, {
        "EPSG:30168": {yx: true}

    }, {
        "EPSG:30169": {yx: true}

    }, {
        "EPSG:30170": {yx: true}

    }, {
        "EPSG:30171": {yx: true}

    }, {
        "EPSG:30172": {yx: true}

    }, {
        "EPSG:30173": {yx: true}

    }, {
        "EPSG:30174": {yx: true}

    }, {
        "EPSG:30175": {yx: true}

    }, {
        "EPSG:30176": {yx: true}

    }, {
        "EPSG:30177": {yx: true}

    }, {
        "EPSG:30178": {yx: true}

    }, {
        "EPSG:30179": {yx: true}

    }, {
        "EPSG:30800": {yx: true}

    }, {
        "EPSG:31251": {yx: true}

    }, {
        "EPSG:31252": {yx: true}

    }, {
        "EPSG:31253": {yx: true}

    }, {
        "EPSG:31254": {yx: true}

    }, {
        "EPSG:31255": {yx: true}

    }, {
        "EPSG:31256": {yx: true}

    }, {
        "EPSG:31257": {yx: true}

    }, {
        "EPSG:31258": {yx: true}

    }, {
        "EPSG:31259": {yx: true}

    }, {
        "EPSG:31275": {yx: true}

    }, {
        "EPSG:31276": {yx: true}

    }, {
        "EPSG:31277": {yx: true}

    }, {
        "EPSG:31278": {yx: true}

    }, {
        "EPSG:31279": {yx: true}

    }, {
        "EPSG:31281": {yx: true}

    }, {
        "EPSG:31282": {yx: true}

    }, {
        "EPSG:31283": {yx: true}

    }, {
        "EPSG:31284": {yx: true}

    }, {
        "EPSG:31285": {yx: true}

    }, {
        "EPSG:31286": {yx: true}

    }, {
        "EPSG:31287": {yx: true}

    }, {
        "EPSG:31288": {yx: true}

    }, {
        "EPSG:31289": {yx: true}

    }, {
        "EPSG:31290": {yx: true}

    }, {
        "EPSG:31466": {yx: true}

    }, {
        "EPSG:31467": {yx: true}

    }, {
        "EPSG:31468": {yx: true}

    }, {
        "EPSG:31469": {yx: true}

    }, {
        "EPSG:31700": {yx: true}

    }];

    _.each(codes, function(codeObj, key) {
        jQuery.extend(OpenLayers.Projection.defaults, codeObj);
    });
})(window);