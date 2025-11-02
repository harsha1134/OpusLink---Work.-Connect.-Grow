class LanguageManager {
    constructor() {
        this.currentLang = localStorage.getItem('preferredLanguage') || 'en';
        this.teluguMap = {
            // Common & Navigation
            'toggle_language': 'తెలుగు',
            'english': 'ఆంగ్లం',
            'telugu': 'తెలుగు',
            'login': 'లాగిన్',
            'logout': 'లాగ్అవుట్',
            'profile': 'ప్రొఫైల్',
            'settings': 'సెట్టింగ్స్',
            'save': 'సేవ్',
            'cancel': 'రద్దు చేయండి',
            'submit': 'సమర్పించండి',
            'continue': 'కొనసాగించు',
            'back': 'వెనక్కి',
            'next': 'తదుపరి',
            'search': 'శోధించు',
            'filter': 'ఫిల్టర్',
            'clear': 'క్లియర్',
            'loading': 'లోడ్ అవుతోంది',
            'error': 'లోపం',
            'success': 'విజయం',
            'warning': 'హెచ్చరిక',
            'info': 'సమాచారం',

            // Auth & Roles
            'employer': 'ఉద్యోగదాత',
            'worker': 'కార్మికుడు',
            'job_seeker': 'ఉద్యోగ అభ్యర్థి',
            'company': 'కంపెనీ',
            'organization': 'సంస్థ',
            
            // Landing Page
            'opuslink_connect_talent': 'ఓపస్ లింక్ - ప్రతిభను అవకాశంతో కలపండి',
            'where_great_talent_meets_great_opportunity': 'అద్భుత ప్రతిభ అద్భుత అవకాశాలను కలిసిన చోట',
            'opuslink_bridges_gap': 'ఓపస్ లింక్ ఉద్యోగదాతలు మరియు నైపుణ్యం కలిగిన ప్రొఫెషనల్స్ మధ్య అన్ని పరిశ్రమల్లో ఖాళీని పూరించేది - టెక్ నుండి ట్రేడ్స్ వరకు, హెల్త్ కేర్ నుండి హాస్పిటాలిటీ వరకు.',
            'hire_talent': 'టాలెంట్ ను నియమించుకోండి',
            'find_work': 'పని కనుగొనండి',
            'companies_hiring': 'కంపెనీలు నియామకం చేస్తున్నాయి',
            'professionals_hired': 'ప్రొఫెషనల్స్ నియమించబడ్డారు',
            'job_categories': 'ఉద్యోగ వర్గాలు',
            'features': 'విశేషాలు',
            'how_it_works': 'ఇది ఎలా పని చేస్తుంది',
            'all_job_categories': 'అన్ని ఉద్యోగ వర్గాలు',
            'find_opportunities_across_industries': 'ప్రతి పరిశ్రమ మరియు నైపుణ్య స్థాయిలో అవకాశాలను కనుగొనండి',
            'why_choose_opuslink': 'ఎందుకు ఓపస్ లింక్ ని ఎంచుకోవాలి',
            'fast_matching': 'ఫాస్ట్ మ్యాచింగ్',
            'fast_matching_description': 'AI-పవర్డ్ మ్యాచింగ్ సరైన టాలెంట్ ను అన్ని పరిశ్రమల్లో సరైన అవకాశాలతో కనెక్ట్ చేస్తుంది.',
            'verified_profiles': 'ధృవీకరించబడిన ప్రొఫైల్స్',
            'verified_profiles_description': 'ప్రతి ప్రొఫెషనల్ మరియు కంపెనీ మీ శాంతికోసం సంపూర్ణంగా ధృవీకరించబడ్డాయి.',
            'all_opportunity_types': 'అన్ని అవకాశ రకాలు',
            'all_opportunity_types_description': 'ఫుల్-టైమ్ రోల్స్ నుండి ఫ్రీలాన్స్ గిగ్స్, కాంట్రాక్ట్స్ మరియు డెయిలీ వర్క్ వరకు - మేము అన్నింటిని కవర్ చేస్తాము.',
            'smart_analytics': 'స్మార్ట్ అనలిటిక్స్',
            'smart_analytics_description': 'డిటెయిల్డ్ ఇన్సైట్స్ తో అప్లికేషన్లు, ప్రతిస్పందనలు మరియు పనితీరును ట్రాక్ చేయండి.',
            'how_opuslink_works': 'ఓపస్ లింక్ ఎలా పని చేస్తుంది',
            'sign_up_choose_role': 'సైన్ అప్ & రోల్ ఎంచుకోండి',
            'sign_up_description': 'ఎంప్లాయర్ లేదా జాబ్ సీకర్ గా ఏదైనా పరిశ్రమలో రిజిస్టర్ చేయండి',
            'complete_profile': 'ప్రొఫైల్ పూర్తి చేయండి',
            'complete_profile_description': 'మీ కంపెనీ అవసరాలు లేదా ప్రొఫెషనల్ నైపుణ్యాల గురించి మాకు తెలియజేయండి',
            'get_matched': 'మ్యాచ్ అవ్వండి',
            'get_matched_description': 'మా సిస్టమ్ మీ ప్రమాణాల ఆధారంగా పర్ఫెక్ట్ మ్యాచ్లను కనుగొంటుంది',
            'connect_succeed': 'కనెక్ట్ & విజయం సాధించండి',
            'connect_succeed_description': 'సంభాషణలు ప్రారంభించండి మరియు విజయవంతమైన భాగస్వామ్యాలను నిర్మించండి',
            'ready_to_transform': 'మీ కెరీర్ లేదా బిజినెస్ ను ట్రాన్స్ఫార్మ్ చేయడానికి సిద్ధంగా ఉన్నారా?',
            'join_thousands_successful': 'నేడే ఓపస్ లింక్ లో వేలకొలది విజయవంతమైన కనెక్షన్లలో చేరండి',
            'start_hiring': 'నియామకం ప్రారంభించండి',
            'find_jobs': 'ఉద్యోగాలు కనుగొనండి',
            'get_started': 'ప్రారంభించండి',
            'connecting_talent_opportunity': 'అన్ని పరిశ్రమల్లో ప్రతిభను అవకాశంతో కలుపుతోంది',
            
            // Job Categories
            'tech_it': 'టెక్ & ఐటి',
            'tech_it_description': 'డెవలపర్లు, డిజైనర్లు, డేటా సైంటిస్ట్లు, సైబర్ సెక్యూరిటీ',
            'corporate': 'కార్పొరేట్',
            'corporate_description': 'సేల్స్, మార్కెటింగ్, HR, ఫైనాన్స్, అడ్మినిస్ట్రేషన్',
            'skilled_trades': 'స్కిల్డ్ ట్రేడ్స్',
            'skilled_trades_description': 'ఎలక్ట్రీషియన్లు, ప్లంబర్లు, మెకానిక్లు, కన్స్ట్రక్షన్',
            'delivery_transport': 'డెలివరీ & ట్రాన్స్పోర్ట్',
            'delivery_transport_description': 'డ్రైవర్లు, లాజిస్టిక్స్, వేర్హౌస్, డెలివరీ పార్టనర్లు',
            'healthcare': 'హెల్త్ కేర్',
            'healthcare_description': 'డాక్టర్లు, నర్సులు, పారామెడికల్స్, మెడికల్ స్టాఫ్',
            'hospitality': 'హాస్పిటాలిటీ',
            'hospitality_description': 'చెఫ్లు, వెయిటర్లు, హోటల్ స్టాఫ్, రెస్టారెంట్ వర్కర్స్',
            'education': 'ఎడ్యుకేషన్',
            'education_description': 'టీచర్లు, ట్యూటర్లు, ట్రైనర్లు, ఎడ్యుకేషన్ స్టాఫ్',
            'retail': 'రిటైల్',
            'retail_description': 'సేల్స్ అసోసియేట్స్, క్యాషియర్లు, స్టోర్ మేనేజర్లు',
            'creative_media': 'క్రియేటివ్ & మీడియా',
            'creative_media_description': 'డిజైనర్లు, రైటర్లు, ఫోటోగ్రాఫర్లు, ఎడిటర్లు',
            'manufacturing': 'మాన్యుఫాక్చరింగ్',
            'manufacturing_description': 'ఫ్యాక్టరీ వర్కర్స్, మెషిన్ ఆపరేటర్లు, క్వాలిటీ కంట్రోల్',
            'home_services': 'హోమ్ సర్వీసెస్',
            'home_services_description': 'డొమెస్టిక్ హెల్ప్, కేర్ గివర్స్, కుక్స్, క్లీనర్స్',
            'other_professionals': 'ఇతర ప్రొఫెషనల్స్',
            'other_professionals_description': 'లీగల్, కన్సల్టింగ్, రీసెర్చ్, స్పెషలైజ్డ్ సర్వీసెస్',
            
            // Hero Section
            'hiring_multiple_roles': 'బహుళ పాత్రలను నియమిస్తోంది',
            'multiple_locations': 'బహుళ స్థానాలు',
            'full_stack_developer': 'ఫుల్ స్టాక్ డెవలపర్',
            'years_experience': '3+ సంవత్సరాల అనుభవం',
            'certified_electrician': 'సర్టిఫైడ్ ఎలక్ట్రీషియన్',
            'projects_completed': '50+ ప్రాజెక్టులు పూర్తయ్యాయి',
            
            // Footer
            'for_job_seekers': 'ఉద్యోగ అభ్యర్థుల కోసం',
            'career_resources': 'కెరీర్ వనరులు',
            'success_stories': 'విజయ కథనాలు',
            'for_employers': 'ఉద్యోగదాతల కోసం',
            'post_jobs': 'ఉద్యోగాలు పోస్ట్ చేయండి',
            'find_talent': 'టాలెంట్ ను కనుగొనండి',
            'pricing': 'ధరలు',
            'company': 'కంపెనీ',
            'about_us': 'మా గురించి',
            'contact': 'సంప్రదించండి',
            'privacy_policy': 'గోప్యతా విధానం',
            'all_rights_reserved': 'అన్ని హక్కులు ప్రత్యేకించబడినవి',

            // Login Page
            'email_placeholder': 'ఉదాహరణ@ఈమెయిల్.కామ్',
            'password_placeholder': '********',
            'select_role': 'పాత్రను ఎంచుకోండి',
            'demo_accounts': 'డెమో ఖాతాలు:',
            'employer_demo': 'ఉద్యోగదాత: admin@acmecorp.com / password123',
            'job_seeker_demo': 'ఉద్యోగ అభ్యర్థి: ravi@example.com / password123',

            // Role Selection
            'select_your_role': 'మీ పాత్రను ఎంచుకోండి',
            'hire_skilled_professionals': 'అన్ని పరిశ్రమల్లో నైపుణ్యం కలిగిన ప్రొఫెషనల్స్ ను నియమించుకోండి మరియు మీ వ్యాపారాన్ని వృద్ధి చేయండి.',
            'find_jobs_showcase_skills': 'ఉద్యోగాలను కనుగొనండి, మీ నైపుణ్యాలను ప్రదర్శించండి మరియు 15+ వర్గాల్లో నియమించబడండి.',

            // Profile Setup
            'enter_organization_name': 'సంస్థ పేరు నమోదు చేయండి',
            'select_category': 'వర్గాన్ని ఎంచుకోండి',
            'select_size': 'పరిమాణాన్ని ఎంచుకోండి',
            'select_experience': 'అనుభవాన్ని ఎంచుకోండి',
            'select_work_type': 'పని రకాన్ని ఎంచుకోండి',
            'step_2_company_profile': 'దశ 2: కంపెనీ ప్రొఫైల్',
            'step_2_professional_profile': 'దశ 2: ప్రొఫెషనల్ ప్రొఫైల్',
            'primary_job_category': 'ప్రాథమిక ఉద్యోగ వర్గం',
            'work_type_preference': 'పని రకం ప్రాధాన్యత',
            'expected_salary': 'ఆశించిన జీతం',
            'skills_comma_separated': 'నైపుణ్యాలు (కామా వేరు చేయబడినవి)',
            'preferred_location': 'ఇష్టపడే స్థానం',
            'brief_bio_introduction': 'సంక్షిప్త బయో/పరిచయం',
            'industry_field': 'పరిశ్రమ / రంగం',
            'company_website': 'కంపెనీ వెబ్సైట్',
            'company_description': 'కంపెనీ వివరణ',
            'highest_qualification': 'అత్యధిక అర్హత',
            'account_setup': 'ఖాతా సెటప్',
            'step_1_create_account': 'దశ 1: మీ ఖాతాను సృష్టించండి',
            'enter_basic_details': 'కొనసాగించడానికి మీ ప్రాథమిక వివరాలను నమోదు చేయండి',
            'full_name_placeholder': 'జాన్ డో',
            'confirm_password': 'పాస్వర్డ్ ని నిర్ధారించండి',
            'phone_placeholder': '+91 9876543210',
            'next': 'తదుపరి',

            // OTP Verification
            'enter_otp_sent': 'మీ ఈమెయిల్ కు పంపబడిన OTP నమోదు చేయండి',
            'verify_complete_registration': 'ధృవీకరించండి & రిజిస్ట్రేషన్ పూర్తి చేయండి',
            'didnt_receive_code': 'కోడ్ రాలేదా?',
            'resend_otp': 'OTP తిరిగి పంపండి',
            'step_4_verify_account': 'దశ 4: మీ ఖాతాను ధృవీకరించండి',

            // Document Verification
            'upload_required_documents': 'ధృవీకరణ కోసం అవసరమైన డాక్యుమెంట్స్ అప్లోడ్ చేయండి',
            'submit_verification': 'ధృవీకరణ సమర్పించండి',
            'skip_for_now': 'ప్రస్తుతానికి స్కిప్ చేయండి',
            'document_verification': 'డాక్యుమెంట్ ధృవీకరణ',

            // Dashboard Common
            'dashboard_overview': 'డాష్బోర్డ్ అవలోకనం',
            'active_jobs': 'సక్రియ ఉద్యోగాలు',
            'posted_jobs': 'పోస్ట్ చేసిన ఉద్యోగాలు',
            'total_applications': 'మొత్తం దరఖాస్తులు',
            'received_applications': 'అందిన దరఖాస్తులు',
            'hired': 'నియమించబడ్డారు',
            'successful_hires': 'విజయవంతమైన నియామకాలు',
            'recent_applications': 'ఇటీవలి దరఖాస్తులు',
            'no_applications_yet': 'ఇంకా దరఖాస్తులు లేవు',
            'quick_actions': 'క్విక్ యాక్షన్స్',
            'post_new_job': 'కొత్త ఉద్యోగం పోస్ట్ చేయండి',
            'manage_listings_review_applicants': 'మీ ఉద్యోగ లిస్టింగ్స్ ని మేనేజ్ చేయండి మరియు అప్లికెంట్స్ ను రివ్యూ చేయండి',
            'no_active_jobs': 'సక్రియ ఉద్యోగాలు లేవు',
            'post_first_job': 'మీ మొదటి ఉద్యోగాన్ని పోస్ట్ చేయండి',

            // Employer Dashboard
            'employer_panel': 'ఉద్యోగదాత ప్యానెల్',
            'browse_workers': 'కార్మికులను బ్రౌజ్ చేయండి',
            'post_job': 'ఉద్యోగం పోస్ట్ చేయండి',
            'manage_jobs': 'ఉద్యోగాలను నిర్వహించండి',
            'applications': 'దరఖాస్తులు',
            'active_agreements': 'సక్రియ ఒప్పందాలు',
            'pending_work': 'పెండింగ్ పని',
            'payment_history': 'చెల్లింపు చరిత్ర',
            'messages': 'సందేశాలు',
            'feedback_reviews': 'ఫీడ్బ్యాక్ & రివ్యూలు',
            'find_connect_skilled_workers': 'స్కిల్డ్ వర్కర్స్ ను కనుగొనండి మరియు కనెక్ట్ అవ్వండి',
            'search_skills_name_category': 'నైపుణ్యాలు, పేరు, వర్గం లేదా లొకేషన్ ద్వారా శోధించండి',
            'all_categories': 'అన్ని వర్గాలు',
            'all_districts': 'అన్ని జిల్లాలు',
            'all_cities': 'అన్ని నగరాలు',
            'all_experience_levels': 'అన్ని అనుభవ స్థాయిలు',
            'no_active_filters': 'సక్రియ ఫిల్టర్లు లేవు',
            'showing_workers': 'కార్మికులను చూపిస్తోంది',
            'no_workers_found': 'కార్మికులు కనుగొనబడలేదు',
            'adjust_search_criteria': 'మీ శోధన ప్రమాణాలను సర్దుబాటు చేయండి లేదా ఫిల్టర్లను క్లియర్ చేయండి',
            'list_view': 'లిస్ట్ వ్యూ',
            'grid_view': 'గ్రిడ్ వ్యూ',
            'job_title': 'ఉద్యోగ శీర్షిక',
            'job_type': 'ఉద్యోగ రకం',
            'job_location': 'ఉద్యోగ స్థానం',
            'job_description': 'ఉద్యోగ వివరణ',
            'job_requirements': 'ఉద్యోగ అవసరాలు',
            'required_skills': 'అవసరమైన నైపుణ్యాలు',
            'publish_job': 'ఉద్యోగాన్ని పబ్లిష్ చేయండి',

            // Worker Dashboard
            'job_seeker_dashboard': 'ఉద్యోగ అభ్యర్థి డాష్బోర్డ్',
            'my_applications': 'నా దరఖాస్తులు',
            'job_offers': 'ఉద్యోగ ఆఫర్లు',
            'saved_jobs': 'సేవ్ చేసిన ఉద్యోగాలు',
            'my_agreements': 'నా ఒప్పందాలు',
            'work_history': 'పని చరిత్ర',
            'earnings': 'సంపాదన',
            'job_feed': 'ఉద్యోగ ఫీడ్',
            'jobs_found': 'ఉద్యోగాలు కనుగొనబడ్డాయి',
            'match_your_profile': 'మీ ప్రొఫైల్ కు సరిపోతాయి',
            'search_jobs_placeholder': 'ఉద్యోగ శీర్షిక, కంపెనీ, నైపుణ్యాలు లేదా స్థానం ద్వారా శోధించండి...',
            'no_jobs_available': 'ఉద్యోగాలు లేవు',
            'jobs_matching_profile': 'మీ ప్రొఫైల్ కు సరిపోయే ఉద్యోగాలు ఇక్కడ కనిపిస్తాయి',
            'no_saved_jobs': 'సేవ్ చేసిన ఉద్యోగాలు లేవు',
            'saved_jobs_appear_here': 'మీరు సేవ్ చేసిన ఉద్యోగాలు ఇక్కడ క్విక్ యాక్సెస్ కోసం కనిపిస్తాయి',
            'worker_profile': 'కార్మిక ప్రొఫైల్',
            'profile_strength': 'ప్రొఫైల్ బలం',
            'profile_completion': 'ప్రొఫైల్ పూర్తి చేయడం',
            'complete': 'పూర్తి',
            'tips_improve_profile': 'మీ ప్రొఫైల్ ను మెరుగుపరచడానికి చిట్కాలు:',
            'verification_documents': 'ధృవీకరణ డాక్యుమెంట్స్',
            'upload_aadhaar_pan_resume': 'ఆధార్, PAN, రెజ్యూమ్ లేదా ఇతర ధృవీకరణ డాక్యుమెంట్స్ అప్లోడ్ చేయండి',
            'upload_document': 'డాక్యుమెంట్ అప్లోడ్ చేయండి',
            'full_name': 'పూర్తి పేరు',
            'phone_number': 'ఫోన్ నంబర్',
            'expected_salary_month': 'ఆశించిన జీతం (₹/నెల)',
            'bio_about_me': 'బయో/నా గురించి',
            'update_profile': 'ప్రొఫైల్ నవీకరించండి',
            'auto_fill_sample_data': 'సాంపిల్ డేటా ఆటో-ఫిల్ చేయండి',

            // Form Fields & Buttons
            'company_name': 'కంపెనీ పేరు',
            'industry': 'పరిశ్రమ',
            'location': 'స్థానం',
            'website': 'వెబ్సైట్',
            'description': 'వివరణ',
            'education': 'విద్య',
            'skills': 'నైపుణ్యాలు',
            'bio': 'బయో',
            'update': 'నవీకరించండి',
            'view': 'చూడండి',
            'edit': 'సవరించు',
            'delete': 'తొలగించు',
            'download': 'డౌన్లోడ్',
            'upload': 'అప్లోడ్',
            'apply': 'దరఖాస్తు చేయండి',
            'send': 'పంపండి',
            'confirm': 'నిర్ధారించండి',
            'approve': 'ఆమోదించండి',
            'reject': 'తిరస్కరించండి',
            'close': 'మూసివేయండి',

            // Status & Messages
            'pending': 'పెండింగ్ లో ఉంది',
            'approved': 'ఆమోదించబడింది',
            'rejected': 'తిరస్కరించబడింది',
            'completed': 'పూర్తయింది',
            'in_progress': 'పురోగతిలో ఉంది',
            'cancelled': 'రద్దు చేయబడింది',
            'successful': 'విజయవంతమైంది',
            'failed': 'విఫలమైంది',
            'active': 'సక్రియం',
            'inactive': 'నిష్క్రియం',
            'online': 'ఆన్లైన్',
            'offline': 'ఆఫ్లైన్',
            'notifications': 'నోటిఫికేషన్స్',
            'notifications_subtitle': 'మీ కార్యకలాపాలతో నవీకరించబడి ఉండండి',
            'unread_notifications': 'చదవని నోటిఫికేషన్స్',
            'total_notifications': 'మొత్తం నోటిఫికేషన్స్',
            'all_types': 'అన్ని రకాలు',
            'all_status': 'అన్ని స్థితి',
            'unread': 'చదవని',
            'read': 'చదివిన',
            'mark_all_read': 'అన్నీ చదివినట్లు గుర్తించండి',
            'clear_all': 'అన్నీ తొలగించండి',
            'test_notifications': 'టెస్ట్ నోటిఫికేషన్స్',
            'no_notifications': 'నోటిఫికేషన్స్ లేవు',
            'notifications_will_appear_here': 'మీ కార్యకలాపాల గురించి నోటిఫికేషన్స్ ఇక్కడ కనిపిస్తాయి',
            'applications': 'అప్లికేషన్స్',
            'payments': 'చెల్లింపులు',
            'agreements': 'ఒప్పందాలు',
            'system': 'సిస్టమ్'
        };
    }

    // Toggle between English and Telugu
    toggleLanguage() {
        this.currentLang = this.currentLang === 'en' ? 'te' : 'en';
        localStorage.setItem('preferredLanguage', this.currentLang);
        this.applyTranslations();
        
        // Show notification if OpusUtils is available
        if (window.OpusUtils) {
            OpusUtils.showNotification(`Language changed to ${this.currentLang === 'en' ? 'English' : 'Telugu'}`, 'success');
        }
        
        return this.currentLang;
    }

    // Translate a key
    t(key) {
        if (this.currentLang === 'te' && this.teluguMap[key]) {
            return this.teluguMap[key];
        }
        return key;
    }

    // Apply translations to entire page
    applyTranslations() {
        // Update all elements with data-translate attribute
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            const translation = this.t(key);
            if (translation !== key) {
                element.textContent = translation;
            }
        });

        // Update placeholders
        document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
            const key = element.getAttribute('data-translate-placeholder');
            const translation = this.t(key);
            if (translation !== key) {
                element.placeholder = translation;
            }
        });

        // Update input values
        document.querySelectorAll('[data-translate-value]').forEach(element => {
            const key = element.getAttribute('data-translate-value');
            const translation = this.t(key);
            if (translation !== key) {
                element.value = translation;
            }
        });

        // Update page title if it has data attribute
        const title = document.querySelector('title[data-translate]');
        if (title) {
            const key = title.getAttribute('data-translate');
            document.title = this.t(key);
        }

        // Update language toggle button text
        this.updateToggleButton();
    }

    // Update the toggle button text
    updateToggleButton() {
        const toggleBtn = document.getElementById('langToggleBtn');
        if (toggleBtn) {
            const textElement = toggleBtn.querySelector('[data-translate="toggle_language"]') || toggleBtn;
            if (this.currentLang === 'en') {
                textElement.textContent = this.t('toggle_language');
            } else {
                textElement.textContent = this.t('english');
            }
        }
    }

    // Get current language
    getCurrentLanguage() {
        return this.currentLang;
    }

    // Initialize on page load
    init() {
        this.applyTranslations();
    }
}

// Create global instance
const languageManager = new LanguageManager();

// Make available globally
window.languageManager = languageManager;
window.toggleLanguage = function() {
    return languageManager.toggleLanguage();
};

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        languageManager.init();
    });
} else {
    languageManager.init();
}