import { useState, useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ChevronDown, Sparkles, ArrowRight, Instagram, Facebook, Twitter, Mail, Phone, MapPin, Star, Heart } from "lucide-react";
import heroBackground from "../assets/images/background-4.jpeg";
import heroBackground2 from "../assets/images/background-1.jpeg";
import heroBackground3 from "../assets/images/background-5.jpeg";
import heroBackground4 from "../assets/images/background-3.jpeg";
import product1 from "../assets/images/product-1.jpeg";
import product2 from "../assets/images/product-5.jpeg";
import product3 from "../assets/images/product-3.jpeg";
import product4 from "../assets/images/product-4.jpeg";
import infoBackground from "../assets/images/info-1.jpeg";

export default function Homepage() {
    const { scrollY } = useScroll();
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);
    const scale = useTransform(scrollY, [0, 300], [1, 0.8]);

    const backgrounds = [heroBackground, heroBackground2, heroBackground3, heroBackground4];
    const [currentBgIndex, setCurrentBgIndex] = useState(0);
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitted(true);
        setTimeout(() => {
            setIsSubmitted(false);
            setEmail("");
        }, 3000);
    };

    // Auto-rotate backgrounds every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentBgIndex((prevIndex) => (prevIndex + 1) % backgrounds.length);
        }, 5000); // Change image every 5 seconds

        return () => clearInterval(interval);
    }, []);

    const products = [
        {
            id: 1,
            name: "ESTHER'S COURAGE",
            description: "Velvet Lip Gloss",
            size: "4.2 oz / 120ml",
            price: "₦5,000",
            image: product1,
            scripture: "For such a time as this - Esther 4:14"
        },
        {
            id: 2,
            name: "RUTH'S LOYALTY",
            description: "Satin Lip Liner",
            size: "0.04 oz / 1.2g",
            price: "₦5,000",
            image: product2,
            scripture: "Where you go I will go - Ruth 1:16"
        },
        {
            id: 3,
            name: "DEBORAH'S STRENGTH",
            description: "Matte Lip Gloss",
            size: "4.2 oz / 120ml",
            price: "₦5,000",
            image: product3,
            scripture: "She leads with courage - Judges 4:4"
        },
        {
            id: 4,
            name: "MARY'S GRACE",
            description: "Shimmer Lip Gloss",
            size: "4.2 oz / 120ml",
            price: "₦5,000",
            image: product4,
            scripture: "Blessed among women - Luke 1:42"
        }
    ];

    const reasons = [
        {
            id: 1,
            title: "Faith",
            subtitle: "Rooted in Purpose",
            description: "Beauty that celebrates your God-given identity and divine light within",
            image: heroBackground,
            tag: "faith"
        },
        {
            id: 2,
            title: "Inclusive",
            subtitle: "Every Shade. Every Story.",
            description: "Created for all women, all tones, all backgrounds—because beauty has no boundaries",
            image: heroBackground2,
            tag: "beauty"
        },
        {
            id: 3,
            title: "Bold",
            subtitle: "Courage in Every Color",
            description: "Empowering you to walk confidently in your purpose, unapologetically yourself",
            image: heroBackground3,
            tag: "body"
        },
        {
            id: 4,
            title: "Quality",
            subtitle: "Excellence You Deserve",
            description: "Premium formulas crafted with care—nourishing, long-lasting, and faith-inspired",
            image: heroBackground4,
            tag: "essence"
        }
    ];

    const messages = [
        "Bold. Beautiful. Unstoppable.",
        "✦",
        "Your Faith. Your Beauty. Your Moment.",
        "✦",
        "Coming Soon",
        "✦",
        "Be Bold is Almost Here",
        "✦"
    ];

    const socialLinks = [
        { icon: Instagram, href: "#", label: "Instagram" },
        { icon: Facebook, href: "#", label: "Facebook" },
        { icon: Twitter, href: "#", label: "Twitter" }
    ];

    const footerLinks = {
        shop: [
            { name: "Lip Glosses", href: "#" },
            { name: "Lip Liners", href: "#" },
            { name: "New Arrivals", href: "#" },
            { name: "Best Sellers", href: "#" }
        ],
        about: [
            { name: "Our Story", href: "#" },
            { name: "Mission & Vision", href: "#" },
            { name: "Faith & Beauty", href: "#" },
            { name: "Contact Us", href: "#" }
        ],
        support: [
            { name: "Shipping Info", href: "#" },
            { name: "Returns", href: "#" },
            { name: "FAQs", href: "#" },
            { name: "Track Order", href: "#" }
        ]
    };


    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3,
                delayChildren: 0.5
            }
        }
    };

    const headlineVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut"
            }
        }
    };

    const subheadVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut"
            }
        }
    };

    const buttonVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    const scrollIndicatorVariants = {
        animate: {
            y: [0, 10, 0],
            transition: {
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    const productCardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    return (
        <div>
            <Navbar />

            {/* Hero Section */}
            <section
                className="relative h-screen flex flex-col items-center justify-center overflow-hidden"
            >
                {/* Animated Background Images */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentBgIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        className="absolute inset-0"
                        style={{
                            backgroundImage: `url(${backgrounds[currentBgIndex]})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center 40%'
                        }}
                    />
                </AnimatePresence>
                {/* Overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-purple900/70 via-purple800/50 to-purple900/70" />

                {/* Animated Background Elements */}
                <motion.div
                    className="absolute top-20 left-10 opacity-30"
                    animate={{
                        y: [0, -20, 0],
                        rotate: [0, 5, 0]
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <Sparkles className="w-8 h-8 text-purple100" />
                </motion.div>

                <motion.div
                    className="absolute bottom-32 right-16 opacity-20"
                    animate={{
                        y: [0, 20, 0],
                        rotate: [0, -5, 0]
                    }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                    }}
                >
                    <Sparkles className="w-12 h-12 text-purple200" />
                </motion.div>

                {/* Main Content */}
                <motion.div
                    className="relative z-10 max-w-6xl mx-auto px-6 text-center"
                    style={{ opacity, scale }}
                >
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-col items-center justify-center"
                    >
                        {/* Tagline */}
                        <motion.div
                            variants={headlineVariants}
                            className="mb-4"
                        >
                            <span className="inline-block px-4 py-2 bg-purple100/20 backdrop-blur-sm rounded-full text-purple100 text-sm font-semibold tracking-widest border border-purple100/30">
                                YOUR BOLDEST BET
                            </span>
                        </motion.div>

                        {/* Main Headline */}
                        <motion.h1
                            variants={headlineVariants}
                            className="text-5xl md:text-7xl lg:text-8xl font-bold text-purple100 mb-6 leading-tight"
                        >
                            YOU DON'T NEED
                            <br />
                            <span className="text-purple200">MORE MAKEUP.</span>
                            <br />
                            JUST <span className="italic">BOLDER</span> ONES.
                        </motion.h1>

                        {/* Subheadline */}
                        <motion.p
                            variants={subheadVariants}
                            className="text-sm md:text-md lg:text-xl text-purple100/90 mb-8 max-w-3xl font-light leading-relaxed"
                        >
                            Faith-inspired beauty for every shade, every story, every woman
                            ready to walk boldly in her God-given purpose.
                        </motion.p>

                        {/* Scripture Reference */}
                        {/* <motion.p
                            variants={subheadVariants}
                            className="text-sm md:text-base text-purple200 italic mb-12 font-serif"
                        >
                            "She is clothed with strength and dignity, and she laughs without fear of the future."
                            <span className="block mt-1 text-purple100/70 not-italic text-xs">— PROVERBS 31:25</span>
                        </motion.p> */}

                        {/* CTA Buttons */}
                        <motion.div
                            variants={buttonVariants}
                            className="flex flex-col sm:flex-row gap-4 my-4"
                        >
                            <motion.a
                                href="#shop"
                                whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(211, 145, 128, 0.3)" }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-purple200 text-white font-bold rounded-full hover:bg-purple300 transition-all duration-300 shadow-lg"
                            >
                                SHOP THE COLLECTION
                            </motion.a>

                            <motion.a
                                href="#about"
                                whileHover={{ scale: 1.05, borderColor: "rgba(243, 232, 255, 1)" }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-transparent text-purple100 font-bold rounded-full border-2 border-purple100/50 hover:bg-purple100/10 transition-all duration-300"
                            >
                                OUR STORY
                            </motion.a>
                        </motion.div>

                        {/* Social Proof */}
                        {/* <motion.div
                            variants={subheadVariants}
                            className="flex items-center gap-8 text-purple100/80 text-sm"
                        >
                            <div className="flex flex-col items-center">
                                <span className="text-2xl font-bold text-purple100">100%</span>
                                <span className="text-xs">Shade Inclusive</span>
                            </div>
                            <div className="w-px h-8 bg-purple100/30" />
                            <div className="flex flex-col items-center">
                                <span className="text-2xl font-bold text-purple100">Faith</span>
                                <span className="text-xs">Driven Beauty</span>
                            </div>
                            <div className="w-px h-8 bg-purple100/30" />
                            <div className="flex flex-col items-center">
                                <span className="text-2xl font-bold text-purple100">12-80</span>
                                <span className="text-xs">Every Generation</span>
                            </div>
                        </motion.div> */}
                    </motion.div>
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    variants={scrollIndicatorVariants}
                    animate="animate"
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 text-purple100/60 cursor-pointer z-10"
                    onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                >
                    <span className="text-xs tracking-widest uppercase">Explore</span>
                    <ChevronDown className="w-6 h-6" />
                </motion.div>
            </section>

            {/* Shop Section */}
            <section id="shop" className="py-20 bg-purple50">
                <div className="max-w-8xl mx-auto px-16">
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="flex items-center justify-between my-10"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-purple900 tracking-wide uppercase">
                            Best Sellers
                        </h2>
                        <motion.a
                            href="/shop"
                            whileHover={{ x: 5 }}
                            className="flex items-center gap-2 text-purple800 font-semibold hover:text-purple500 transition-colors group"
                        >
                            <span className="hidden sm:inline">View All</span>
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </motion.a>
                    </motion.div>

                    {/* Product Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.map((product, index) => (
                            <motion.div
                                key={product.id}
                                variants={productCardVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group"
                            >
                                {/* Product Image Container */}
                                <div className="relative bg-purple100/30 rounded-lg overflow-hidden mb-4 aspect-square">
                                    <motion.img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ duration: 0.4 }}
                                    />

                                    {/* Hover Overlay with Scripture */}
                                    <div className="absolute inset-0 bg-purple900/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6">
                                        <p className="text-purple100 text-center text-sm italic font-serif">
                                            "{product.scripture}"
                                        </p>
                                    </div>
                                </div>

                                {/* Product Info */}
                                <div className="space-y-2">
                                    <h3 className="text-purple900 font-bold text-sm uppercase tracking-wide">
                                        {product.name}
                                    </h3>
                                    <p className="text-purple800/70 text-sm">
                                        {product.description}
                                    </p>
                                    <p className="text-purple800/50 text-xs">
                                        {product.size}
                                    </p>
                                </div>

                                {/* Add to Cart Button */}
                                <motion.button
                                    disabled
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full mt-4 py-3 border-2 border-purple800 text-purple800 font-semibold text-sm uppercase tracking-wide hover:bg-purple800 hover:text-purple50 transition-all duration-300"
                                >
                                    Add to Cart
                                </motion.button>

                                {/* Price */}
                                <p className="text-center mt-3 text-purple900 font-bold">
                                    {product.price}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
            {/* Product Highlight Section */}
            <section className="w-screen h-screen bg-purple800">
                <div className="w-full h-full mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                        {/* Image Side - Left */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative h-screen w-full overflow-hidden"
                        >
                            <motion.img
                                src={infoBackground}
                                alt="Esther's Courage Lip Gloss"
                                className="w-full h-full object-cover"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.6 }}
                            />
                            {/* Subtle overlay for depth */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10" />
                        </motion.div>

                        {/* Content Side - Right */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="bg-purple800 px-8 md:px-12 lg:px-16 py-12 lg:py-16 flex flex-col justify-center"
                        >
                            {/* Section Tag */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.4 }}
                                className="mb-6"
                            >
                                <span className="inline-block px-4 py-1 bg-purple100/20 backdrop-blur-sm rounded-full text-purple100 text-xs font-semibold tracking-widest uppercase border border-purple100/30">
                                    Bestseller
                                </span>
                            </motion.div>

                            {/* Main Heading */}
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.5 }}
                                className="text-3xl md:text-4xl lg:text-5xl font-bold text-purple100 mb-4 uppercase tracking-wide leading-tight"
                            >
                                Radiant Beauty
                                <br />
                                by Be Bold
                            </motion.h2>

                            {/* Product Name */}
                            <motion.h3
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.6 }}
                                className="text-xl md:text-2xl font-semibold text-purple200 mb-6 tracking-wide"
                            >
                                Esther's Courage Velvet Lip Gloss
                            </motion.h3>

                            {/* Description */}
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.7 }}
                                className="text-purple100/90 text-base md:text-lg leading-relaxed mb-6"
                            >
                                Transform your look with our signature Esther's Courage lip gloss, infused with nourishing ingredients and bold pigmentation. This luxurious formula glides on smoothly, delivering intense color and a velvety finish that lasts throughout the day.
                            </motion.p>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.8 }}
                                className="text-purple100/90 text-base md:text-lg leading-relaxed mb-8"
                            >
                                Its lightweight texture absorbs seamlessly, leaving no residue behind. Whether you're seeking to embrace your natural radiance or enhance your boldness, our lip gloss is the perfect daily companion.
                            </motion.p>

                            {/* Scripture */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.9 }}
                                className="border-l-4 border-purple200 pl-4 mb-8"
                            >
                                <p className="text-purple100 italic font-serif text-sm md:text-base">
                                    "For if you remain silent at this time, relief and deliverance will arise from another place...
                                    And who knows but that you have come to your royal position for such a time as this?"
                                </p>
                                <p className="text-purple200 text-xs mt-2 uppercase tracking-wider">
                                    — Esther 4:14
                                </p>
                            </motion.div>

                            {/* Features List */}
                            <motion.ul
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 1 }}
                                className="space-y-3 mb-8"
                            >
                                <li className="flex items-start gap-3 text-purple100/90">
                                    <span className="text-purple200 mt-1">✦</span>
                                    <span>100% Inclusive shades for every skin tone</span>
                                </li>
                                <li className="flex items-start gap-3 text-purple100/90">
                                    <span className="text-purple200 mt-1">✦</span>
                                    <span>Long-lasting velvety finish</span>
                                </li>
                                <li className="flex items-start gap-3 text-purple100/90">
                                    <span className="text-purple200 mt-1">✦</span>
                                    <span>Nourishing formula with vitamin E</span>
                                </li>
                                <li className="flex items-start gap-3 text-purple100/90">
                                    <span className="text-purple200 mt-1">✦</span>
                                    <span>Cruelty-free and faith-inspired</span>
                                </li>
                            </motion.ul>

                            {/* CTA Button */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 1.1 }}
                            >
                                <motion.button
                                    disabled
                                    whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(211, 145, 128, 0.4)" }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-8 py-4 bg-purple200 text-white font-bold rounded-full hover:bg-purple300 transition-all duration-300 shadow-lg uppercase tracking-wide"
                                >
                                    Shop Esther's Courage
                                </motion.button>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>
            {/* Banner */}
            <section className="w-full h-48 bg-purple900 overflow-hidden flex items-center relative">
                {/* First Marquee - Left to Right */}
                <motion.div
                    animate={{
                        x: ["-100%", "0%"]
                    }}
                    transition={{
                        duration: 90,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="flex items-center gap-8 whitespace-nowrap absolute"
                >
                    {[...Array(3)].map((_, index) => (
                        <div key={index} className="flex items-center gap-8">
                            {messages.map((message, msgIndex) => (
                                <span
                                    key={`${index}-${msgIndex}`}
                                    className={`${message === "✦"
                                        ? "text-purple200 text-4xl"
                                        : "text-purple100 text-5xl md:text-6xl lg:text-7xl font-bold uppercase tracking-wider"
                                        }`}
                                >
                                    {message}
                                </span>
                            ))}
                        </div>
                    ))}
                </motion.div>

                {/* Gradient Overlays for smooth edge effect */}
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-purple900 to-transparent z-10" />
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-purple900 to-transparent z-10" />
            </section>
            {/* Why Section */}
            <section className="w-full min-h-screen">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 h-auto md:h-screen"
                >
                    {reasons.map((reason, index) => (
                        <motion.div
                            key={reason.id}
                            variants={cardVariants}
                            className="relative group overflow-hidden h-[500px] md:h-full"
                        >
                            {/* Background Image */}
                            <motion.div
                                className="absolute inset-0"
                                whileHover={{ scale: 1.1 }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                            >
                                <img
                                    src={reason.image}
                                    alt={reason.title}
                                    className="w-full h-full object-cover"
                                />
                            </motion.div>

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-b from-purple900/60 via-purple900/40 to-purple900/80 group-hover:from-purple900/70 group-hover:to-purple900/90 transition-all duration-500" />

                            {/* Content Container */}
                            <div className="relative h-full flex flex-col justify-between p-8 md:p-10">
                                {/* Top: Rotated Tag */}
                                <motion.div
                                    className="self-start"
                                    initial={{ opacity: 0, rotate: -90, x: -20 }}
                                    whileInView={{ opacity: 1, rotate: -90, x: 0 }}
                                    transition={{ delay: index * 0.1 + 0.3, duration: 0.6 }}
                                >
                                    <span className="text-purple100 text-sm md:text-base font-bold tracking-[0.3em] uppercase whitespace-nowrap origin-left">
                                        {reason.tag}
                                    </span>
                                </motion.div>

                                {/* Bottom: Main Content */}
                                <motion.div
                                    className="space-y-4"
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 + 0.5, duration: 0.6 }}
                                >
                                    {/* Title */}
                                    <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-purple100 leading-tight">
                                        {reason.title}
                                    </h3>

                                    {/* Subtitle */}
                                    <p className="text-purple200 text-lg md:text-xl font-semibold">
                                        {reason.subtitle}
                                    </p>

                                    {/* Description - Hidden by default, shows on hover */}
                                    <motion.p
                                        className="text-purple100/90 text-sm md:text-base leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                    >
                                        {reason.description}
                                    </motion.p>

                                    {/* CTA Button */}
                                    <motion.button
                                        disabled
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="mt-4 px-6 py-3 bg-transparent border-2 border-purple100 text-purple100 font-semibold text-sm uppercase tracking-wide rounded-full hover:bg-purple100 hover:text-purple900 transition-all duration-300 opacity-0 group-hover:opacity-100"
                                    >
                                        shop {reason.tag}
                                    </motion.button>
                                </motion.div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            <footer className="bg-purple900 text-purple100 relative overflow-hidden">
                {/* Animated Background Elements */}
                <motion.div
                    className="absolute top-20 left-10 opacity-10"
                    animate={{
                        y: [0, -30, 0],
                        rotate: [0, 10, 0]
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <Star className="w-32 h-32 text-purple200" />
                </motion.div>

                <motion.div
                    className="absolute bottom-32 right-20 opacity-10"
                    animate={{
                        y: [0, 30, 0],
                        rotate: [0, -10, 0]
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2
                    }}
                >
                    <Heart className="w-40 h-40 text-purple200" />
                </motion.div>

                <div className="relative z-10 max-w-8xl mx-auto px-6">
                    {/* Newsletter Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="py-16 border-b border-purple100/20"
                    >
                        <div className="max-w-2xl mx-auto text-center">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="mb-4"
                            >
                                <Star className="w-8 h-8 mx-auto text-purple200 mb-4" />
                            </motion.div>

                            <h3 className="text-3xl md:text-4xl font-bold mb-4">
                                Join the Bold Movement
                            </h3>
                            <p className="text-purple100/80 mb-8 text-lg">
                                Be the first to know about new launches, exclusive offers, and faith-inspired beauty tips.
                            </p>

                            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                    className="flex-1 px-6 py-4 rounded-full bg-purple100/10 border-2 border-purple100/30 text-purple100 placeholder-purple100/50 focus:outline-none focus:border-purple200 transition-all"
                                />
                                <motion.button
                                    type="submit"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-8 py-4 bg-purple200 text-white font-bold rounded-full hover:bg-purple300 transition-all duration-300 shadow-lg"
                                >
                                    {isSubmitted ? "Subscribed! ✓" : "Subscribe"}
                                </motion.button>
                            </form>
                        </div>
                    </motion.div>

                    {/* Main Footer Content */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12"
                    >
                        {/* Brand Column */}
                        <motion.div variants={itemVariants} className="lg:col-span-2">
                            <div className="flex items-center gap-2 mb-6">
                                <span className="text-3xl font-bold">BE</span>
                                <Star className="w-6 h-6 fill-current" />
                                <span className="text-3xl font-bold">BOLD</span>
                            </div>
                            <p className="text-purple100/80 mb-6 leading-relaxed">
                                Faith-inspired beauty for every woman ready to walk boldly in her God-given purpose.
                                More than makeup—it's a movement.
                            </p>
                            <p className="text-purple200 italic text-sm font-serif mb-6">
                                "She is clothed with strength and dignity"
                                <span className="block text-purple100/60 text-xs mt-1">— Proverbs 31:25</span>
                            </p>

                            {/* Social Links */}
                            <div className="flex gap-4">
                                {socialLinks.map((social, index) => (
                                    <motion.a
                                        key={index}
                                        href={social.href}
                                        aria-label={social.label}
                                        whileHover={{ scale: 1.2, rotate: 5 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="w-12 h-12 rounded-full bg-purple100/10 border-2 border-purple100/30 flex items-center justify-center hover:bg-purple200 hover:border-purple200 transition-all"
                                    >
                                        <social.icon className="w-5 h-5" />
                                    </motion.a>
                                ))}
                            </div>
                        </motion.div>

                        {/* Shop Links */}
                        <motion.div variants={itemVariants}>
                            <h4 className="text-xl font-bold mb-6 text-purple200">Shop</h4>
                            <ul className="space-y-3">
                                {footerLinks.shop.map((link, index) => (
                                    <motion.li key={index} whileHover={{ x: 5 }}>
                                        <a href={link.href} className="text-purple100/80 hover:text-purple100 transition-colors">
                                            {link.name}
                                        </a>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* About Links */}
                        <motion.div variants={itemVariants}>
                            <h4 className="text-xl font-bold mb-6 text-purple200">About</h4>
                            <ul className="space-y-3">
                                {footerLinks.about.map((link, index) => (
                                    <motion.li key={index} whileHover={{ x: 5 }}>
                                        <a href={link.href} className="text-purple100/80 hover:text-purple100 transition-colors">
                                            {link.name}
                                        </a>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Support Links */}
                        <motion.div variants={itemVariants}>
                            <h4 className="text-xl font-bold mb-6 text-purple200">Support</h4>
                            <ul className="space-y-3">
                                {footerLinks.support.map((link, index) => (
                                    <motion.li key={index} whileHover={{ x: 5 }}>
                                        <a href={link.href} className="text-purple100/80 hover:text-purple100 transition-colors">
                                            {link.name}
                                        </a>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>
                    </motion.div>

                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="py-8 border-t border-purple100/20"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="flex items-center gap-3"
                            >
                                <div className="w-10 h-10 rounded-full bg-purple100/10 flex items-center justify-center">
                                    <Mail className="w-5 h-5 text-purple200" />
                                </div>
                                <div>
                                    <p className="text-sm text-purple100/60">Email Us</p>
                                    <p className="text-purple100">hello@bebold.com</p>
                                </div>
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="flex items-center gap-3"
                            >
                                <div className="w-10 h-10 rounded-full bg-purple100/10 flex items-center justify-center">
                                    <Phone className="w-5 h-5 text-purple200" />
                                </div>
                                <div>
                                    <p className="text-sm text-purple100/60">Call Us</p>
                                    <p className="text-purple100">+234 (0) 123 456 7890</p>
                                </div>
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="flex items-center gap-3"
                            >
                                <div className="w-10 h-10 rounded-full bg-purple100/10 flex items-center justify-center">
                                    <MapPin className="w-5 h-5 text-purple200" />
                                </div>
                                <div>
                                    <p className="text-sm text-purple100/60">Visit Us</p>
                                    <p className="text-purple100">Lagos, Nigeria</p>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Bottom Bar */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="py-8 border-t border-purple100/20 flex flex-col md:flex-row justify-between items-center gap-4"
                    >
                        <p className="text-purple100/60 text-sm">
                            © 2025 Be Bold. All rights reserved. Made with <Heart className="w-4 h-4 inline fill-current text-purple200" /> and faith.
                        </p>
                        <div className="flex gap-6 text-sm">
                            <motion.a
                                href="#"
                                whileHover={{ scale: 1.1 }}
                                className="text-purple100/60 hover:text-purple100 transition-colors"
                            >
                                Privacy Policy
                            </motion.a>
                            <motion.a
                                href="#"
                                whileHover={{ scale: 1.1 }}
                                className="text-purple100/60 hover:text-purple100 transition-colors"
                            >
                                Terms of Service
                            </motion.a>
                        </div>
                    </motion.div>
                </div>
            </footer>
        </div>
    );
}