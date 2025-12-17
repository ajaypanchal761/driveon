import { useNavigate, Link } from 'react-router-dom';
import ProfileHeader from '../components/layout/ProfileHeader';
import BottomNavbar from '../components/layout/BottomNavbar';
import { colors } from '../theme/colors';
import { useAppSelector } from '../../hooks/redux';
import carImg1 from '../../assets/car_img1-removebg-preview.png';

/**
 * TermsAndConditionsPage Component
 * Terms and Conditions page for DriveOn Host Services
 * Responsive for both mobile and web view
 * Condensed version of the full Terms and Conditions
 */
const TermsAndConditionsPage = () => {
  const navigate = useNavigate();

  // Get authentication state
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { user } = useAppSelector((state) => state.user);

  const termsContent = `TERMS AND CONDITIONS FOR HOSTS & GUESTS

Last Updated - 22 October 2025

Welcome to DriveOn Host Services ("DriveOn Host Services") located at www.driveon.com (the "Site") and the mobile application (the "App"). The Site and App (each the "Platform") are owned and operated by DriveOn India Private Limited, a company incorporated under the Companies Act 1956, having its registered office at Anjaneya Techno Park, First Floor, No. 147, HAL Old Airport Road, ISRO Colony, Kodihalli, Bangalore, Karnataka 560008 (also referred to as "DriveOn", "We," "Us," or "Our").

All access and use of the Platform and the services thereon are governed by our general Platform terms, (the "General Terms"), privacy policy available at https://www.driveon.com/in/host/policy (the "Privacy Policy"), fee policy ("Fee Policy") and service specific terms.

These Terms of Service, including specific terms and conditions applicable to the Hosts and Guests and Add-on Services (these "Host T&Cs") read together with the Privacy Policy, Fee Policy and other applicable policies ("Governing Policies"), collectively create the legally binding terms and conditions on which DriveOn offers to You or the entity You represent ("You", "User" or "Your") the DriveOn Host Services (defined below), including Your access and use of DriveOn Host Services.

Please read each of Governing Policies carefully to ensure that You understand each provision and before using or registering on the website or accessing any material, information, or availing services through the Platform. If You do not agree to any of its terms, please do not use the Platform or avail any services through the Platform. The Governing Policies take effect when You click an "I Agree" button or checkbox presented with these terms or, if earlier, when You use any of the services offered on the Platform (the "Effective Date").

PRIVACY PRACTICES

We understand the importance of safeguarding Your personal information and We have formulated a Privacy Policy to ensure that Your personal information is sufficiently protected. We encourage You to read it to better understand how You can update and manage Your information on the Platform.

AMENDMENTS / MODIFICATIONS

DriveOn reserves the right to change the particulars contained in the Host T&Cs from time to time and at any time. If DriveOn decides to make changes to the Host T&Cs, it will post the updated version on the website and update the date specified above or communicate the same to You by other means. Any change or modification to the Host T&Cs will be effective immediately from the date of upload of the Host T&Cs on the Platform. It is pertinent that You review the Host T&Cs whenever We modify them and keep Yourself updated about the latest terms of Host T&Cs because if You continue to use the DriveOn Host Services after We have posted modified Host T&Cs, You are indicating to Us that You agree to be bound by the modified Host T&Cs.

DRIVEON HOST SERVICES

DriveOn Host Services is a marketplace feature of the Platform that facilitates peer-to-peer car sharing. DriveOn assists owners of vehicles to connect with Users in temporary need of a vehicle ("Guest") for their personal use ("DriveOn Host Services"). The Platform enables individual vehicle owners (with single or less than 10 white board vehicles; referred to as "Retail Hosts") as well as fleet operators (with multiple black board self-drive vehicles referred to as "Fleet Operators") to list their vehicles on the Platform. The Retail Hosts and the Fleet Operators are collectively and commonly referred to as "Host" for the purpose of these Host T&Cs.

DriveOn does not itself own, lease or rent such vehicles in any manner whatsoever and only provides a service connecting the Hosts to the Guests so they may enter into a Car Sharing Agreement (defined below). You understand and agree that DriveOn is not a party to the Car Sharing Agreement entered into between You as the Host of the vehicle or You as the Guest of the vehicle, nor is DriveOn a transportation service, agent, or insurer. DriveOn has no control over the conduct of the Users of the DriveOn Host Services and disclaims all liability in this regard.

ELIGIBILITY

The DriveOn Host Services are intended solely for Users who are 18 years or older and satisfy User specific criteria below. Any use of the DriveOn Host Services by anyone that does not meet these requirements is expressly prohibited.

Host & Vehicle Eligibility Criteria

• The Host must have a valid passport, Aadhar number, GST registration certificate (if applicable) and/or other form of government issued identification document.

• The vehicle(s) proposed to be listed must either be an eligible non-transport/private personal use vehicle or should have the requisite permits, and bear the requisite license plate in compliance with the Motor Vehicles Act, 1988 (MVA) and the Rent-A-Cab Scheme, 1989 ("RAC").

• The vehicle must either be registered in the Host's name; or the Host must hold express authorization from the registered owner to list and operate the vehicle on the Platform and act as Host.

• The Vehicle(s) must have all legally required permits, tax payments, and regulatory clearances for its designated state of operation including but not limited to tax receipts for road tax and other applicable taxes.

• The vehicle must have a valid registration certificate issued by the relevant regional transport authority under Motor Vehicles Act, 1988 ("MVA").

• The vehicle must be less than 7 years old and should meet all legal requirements of the state of its registration and usage.

• The vehicle must comply with all local and national transport laws, including those related to emission standards, road safety, and public transportation regulations.

• The vehicle must be clean, well maintained and have the basic accessories, including safety device as per Our maintenance, component and safety standards/equipment specifications.

• The vehicle must meet Our minimum insurance requirements of having Third Party Comprehensive Insurance as is mandated under Motor Vehicle Act, 1988.

• The vehicle must have fewer than 70,000 kilometers and should have never been declared a total loss.

Guest Eligibility Criteria

• The Guest must have a valid driving license issued by appropriate authority under Government of India.

• The Guest must have a valid passport, Aadhar number and/or other form of government issued identification document.

• The Guest must have no recent vehicle accidents in the last year, major traffic violations in the last 1 year, more than 2 recent moving violations and history of non-payment of failure to pay.

• The Guest must have a clean criminal record, including but not limited to no felony(s), no violent crime(s), theft(s), or offence related to prohibited substance(s).

Please Note: The above-mentioned documents collected for the fulfilment of the eligibility requirements are subject to KYC (Know Your Customer) verification including the Guest's live selfie and such verification must be completed before the start of the booking. We may partner with regulated and government-affiliated third-party service providers for the same (if explicitly consented to by the User).

REGISTERING AND CREATING YOUR ACCOUNT

To access and use the DriveOn Host Services, You shall have to open an account on the Platform with a valid email address by providing certain complete and accurate information and documentation including but not limited to Your name, date of birth, an email address and password, and other identifying information as may be necessary to open the account on the Platform. Each User may open and maintain only one account on the Platform.

For Hosts, required documents include: Registration Certificate, Pollution Under Check Certificate, Car Insurance, Current Address Proof, Valid Government ID Card, and PAN Card.

For Guests, required documents include: Valid Driver's License, Valid Government ID Card, Cancelled Cheque in name of the Host, and Current Address Proof.

Once You have created an account with us, You are responsible for maintaining the confidentiality of Your username, password, and other information used to register and sign into Our Platform, and You are fully responsible for all activities that occur under this username and password.

ONBOARDING VEHICLE BY THE HOST

Once the user account is created, Hosts can onboard and list their vehicle(s) on the Platform for car sharing. Each such booking shall have a defined start time and end time (such period from the Start Time to the End Time being called the "Booking Period") and choice of Designated Location.

Booking can be created from the Platform at least 1 hour in advance. Host shall ensure the availability of the vehicle at the Designated Location for bookings during a booking. Each Listing Period shall be for a minimum of 24 hours and a maximum period of 6 months.

Designated Location: The vehicle shall be parked at Host's own location. The host shall ensure that the vehicle is parked in a clean, safe, and clearly identifiable location (a "Designated Location"). Host shall have the option of specifying up to 2 (two) Designated Locations within the city limits.

ONLINE BOOKING

Once Your account is created on the Platform, the Guest will receive confirmation of successful creation of Guest account from DriveOn. Thereafter, the verified Guests can view the vehicles listed on the Platform and send a booking request for Your vehicle via the Platform.

The Guest will be able to (i) book the trip to start at any time of the day subject to availability; and (ii) choose a start time of the trip from the next hour from the time of the booking.

Upon receipt of a booking request in relation to a vehicle, DriveOn shall confirm such booking and communicate details of the final booking with the Host and the Guest through an email, text message or message via the Platform confirming such booking.

CAR SHARING AGREEMENT

Upon acceptance of the booking by the Host, the Host and Guest will be required to duly enter into a Car Sharing Agreement to formally execute the terms and conditions and commercials for such booking to ensure compliance with the requirements of applicable law. "Car Sharing Agreement" means and includes the Agreement (where vehicle is a white-board vehicle) executed between the Retail Host and the Guest and a Self-Drive Car Rental Agreement (for vehicles black board self-drive vehicles) executed between Fleet Operator and Guest.

The Guest understands and accepts that the trip cannot start unless the Car Sharing Agreement is duly executed over Our Platform.

VEHICLE DELIVERY

Soon after execution of the Car Sharing Agreement the Host shall:

• have the vehicle is cleaned, sanitized, and kept ready for delivery (including servicing and routine maintenance) as per Our maintenance, component, and safety standards/equipment specifications

• keep the vehicle Key(s), original documentation of the Vehicle, including the registration certificate, Vehicle Insurance policy, Pollution Under Control (PUC) Certificate and other mandatory documents, if any, prescribed by the relevant authorities under Applicable Laws (the "Vehicle Documentation") ready for delivery.

• ensure that the vehicle is available for Guest at the Designated Location and at the specified time.

Home Delivery Services:

This add-on service as provided by third party service providers is entirely subject to optional participation of the Guest and requires explicit Host opt-in through the DriveOn Host platform. Separately, Hosts may themselves provide home delivery services to the Guest directly without utilising services of the third party service provider.

VEHICLE USAGE TERMS

The vehicle shall be driven only by the Guest and used in a prudent and careful manner solely for Guest's personal use within the territory specified in the Car Sharing Agreement ("Permitted Territory"), in strict compliance with the requirements of the applicable Laws of India and the conditions of the Car Sharing Agreement (the "Permitted Use").

Other than the Permitted Use, all other uses of the vehicle including the usages as listed in the Car Sharing Agreement (by the Guest and/or any other person(s) directly or indirectly acting through, authorised by or on behalf of the Guest), are strictly prohibited (the "Prohibited Uses") and shall result in immediate termination of the Car Sharing Agreement and DriveOn Host Services without any notice to the Guest.

PAYMENT FACILITATION, FEES & OTHER CHARGES

1. Facilitation Fee: DriveOn shall be entitled to charge the Host a fee in lieu of provision of DriveOn Host Services ("Facilitation Fee"). This Facilitation Fee shall be calculated as a certain percentage (more particularly described in the Fee policy) of the Booking Fee.

2. Platform Fee and Device Management Fee: DriveOn shall be entitled to charge the Host a fee of INR 590 per month in lieu of the safety and operational expense of Host's car ("Platform Fee") to certain Hosts. Further, from May 2023 onwards the Hosts who have recently opted in for device installation may be charged a Device Management Fee instead of the Platform Fee amounting to INR 500 per month.

3. Trip Protection Fee: At the time of booking a vehicle, the Guest shall have to pay upfront a fee for insuring the vehicle at the time of the trip and ("Trip Protection Fee"). DriveOn shall through insurers facilitate such protection plan from time to time on payment of such Trip Protection Fee.

4. Booking Fee: For Guest: The Guest shall be liable to pay a fee ("Booking Fee") for booking the vehicle and it shall be inclusive of the applicable taxes (if any) in force. For Host: The Host shall be paid on the basis of bookings made and shall receive the Booking Fee paid by the Guest on the hourly tariff during booking period.

5. Other payments, refunds, and penalties: In addition to the above Booking Fee and the Trip Protection Fee, the Guest shall also be liable for Add-on Charges (if availed), charges for cancellation, rescheduling, extension of booking period, late return or returns at wrong location, charges for loss of keys, documents, unpaid tolls, traffic violation penalties, and cost for any damages which may include both cost of repair as well as insurance cover as per the standard rates in the Fee Policy.

HOST'S OBLIGATIONS

In connection with use of or access to the DriveOn Host Services the Host shall not, and hereby agrees that it will not, nor advocate, encourage, request, or assist any third party in activity or otherwise, to harm or threaten to harm Users of Our community, including but not limited to, "stalking" or harassing any other Guest or Host of DriveOn community or User of the Platform, collecting or storing any personally identifiable information about any other member or associate of DriveOn community, engaging in physically or verbally abusive or threatening conduct.

The Host is also bound to maintain car conditions and ensure continuity of his listings for agreed upon periods on Our Platform. In this regard, the Host may additionally be liable to a penalty of up to 20 percent of the total Booking Fee if he/she fails to serve the bookings.

Host shall be responsible for filling "Car Ready Checklist" to be filled by Host within 12 hours of booking start time and "Booking End Checklist" within 12 hours of the booking end time or the start time of the next booking.

GUEST'S OBLIGATIONS

Both parties shall be responsible to ensure compliance with the provisions of their respective Car Sharing Agreement at times during the Booking Period and until the return of the vehicle to the Host in good working condition. In addition to other obligations and covenants under the Car Sharing Agreement, as regards the use of the Vehicle during the aforesaid period the Guest shall:

• at his/her expense maintain the cleanliness, condition, and appearance of the vehicle in as good an operating condition as it was on the commencement date of the Booking Period.

• use the Vehicle only for the Permitted Use in conformity with the Host's manual instructions provided as part of Vehicle Documentation, applying the same degree of care when using the vehicle as would ordinarily be exercised if it belonged to the Guest and strictly refrain from Prohibited Use of Vehicle.

• ensure the safekeeping and presence of the Vehicle Documentation in the vehicle. If these documents are lost or stolen, the Guest will be charged the cost of obtaining duplicates and be remitted to the Host along with all other charges for damages and Booking Fee as may be payable to the Host.

ACCIDENT, THEFT, TRAFFIC VIOLATION AND CONFISCATION

All instances of accident, damage, theft, traffic violations, and confiscation of or involving the vehicle during the Booking Period shall be handled by the parties in accordance with the provisions of the Car Sharing Agreement, including alleged damage or other issues. The Hosts and the Guests further agree to honestly represent any claims or allegations of damage and to work in good faith with each other to resolve any disagreement in keeping with the terms of the Car Sharing Agreement.

INSURANCE, TRIP PROTECTION PACKAGES & DAMAGE MANAGEMENT

1. Host Vehicle Insurance: To protect the Host vehicles against damages and theft, and in compliance with the comprehensive insurance requirements as mandated by Motor Vehicles Act, 1988, the Host shall at all times maintain a comprehensive insurance with an insurance company of its choice ("Host Vehicle Insurance").

2. Damage Policy: For Retail Hosts, DriveOn has tie-ups with third party insurance providers who assist in repair of damaged vehicles and provide coverage for total loss and theft of the vehicle. This Damage Policy however is not applicable to Fleet Operators. Fleet Operators maintain separate insurance on their fleet of vehicles.

3. Trip Protection Plan and Trip Protection Fee: The Guest is responsible for payment of all expenses associated with any risks and ensuing damage to the vehicle including without limitation theft, partial or total destruction etc. For each booking made, the Guests are required to select a Trip Protection Plan ("TPP") during checkout. The TPP determines the Guest's maximum liability in the event of vehicle damage during the trip. The guest may avail such TPP by paying the Trip Protection Fee ("TPF") over and above the Booking Fee.

The Guest, however, cannot seek the benefit of this TPP in the event of the following:

• In case the vehicle is damaged, destroyed or stolen due to the deliberate act of Guest or his/her co-driver

• Any damage to the vehicle due to negligence or rash driving on part of the Guest

• The Guest was tested with alcohol in blood or breath or used drugs and or other stimulants prohibited by the law

• The Guest used the vehicle in a manner that is in contravention of law or the traffic regulations

VEHICLE RETURN/REPOSSESSION

Upon the expiry of the Booking Period or earlier termination of the Car Sharing Agreement (except termination on account of theft or total destruction/loss of the vehicle), Guest must at his/her own cost return the vehicle in the almost the same order and condition, as the Vehicle was at the time of commencement of the Booking Period, except normal wear and tear, with Vehicle Documentation, vehicle's key, key fob, in-vehicle devices and other starting device in its designated position in the vehicle to the Specified Location within the period specified in the Car Sharing Agreement.

However, in case:

• The Guest returns the vehicle at a place other than the Designated Location; the Guest will be charged the cost of transportation of the vehicle from such place to the Designated Location.

• The Guest does not return the Vehicle within the specified period, Guest will be charged late return penalty specified in Our Fees Policy till such time as the vehicle is returned to the Host.

• Damage caused to the returning vehicle, other than excepted wear and tear, the Guest will be charged penalty for such damages at the rate specified in Our Fees Policy.

TERMINATION OF HOST T&CS / DRIVEON HOST SERVICES

These Host T&Cs shall continue to apply and shall remain valid till the time the concerned party continues to use DriveOn Services through its Platform or is terminated by either You or DriveOn ("Term").

If You want to terminate these Host T&Cs, You may do so by (i) not accessing the Platform or the DriveOn Services; or (ii) closing Your account on the Platform for all of the bookings of vehicles, as applicable, where such option is available to You, as the case may be; or (iii) discontinuing any further use of the Platform.

Additionally, DriveOn shall have the sole discretion to suspend or terminate these Host T&Cs and discontinue DriveOn Services and/or services provided by Us (through the Platform or otherwise) by providing 30 (Thirty) days' prior notice to You. However, We may, at any time, with or without notice, suspend or terminate these Host T&Cs and DriveOn Services if We are required to do so by law, the provision of the DriveOn Services to You by DriveOn is, in Our sole discretion, no longer commercially viable to us, the User fails to make any of the payments or part thereof or any other payment required to be made to DriveOn hereunder, the User fails to perform or observe any other covenant, conditions, or agreement to be performed or observed by it under any of the Governing Policies, termination of the listing or the booking on account of any wrongdoing of either party and/or violation of any terms, conditions and obligations of this Host T&Cs and/or the Governing Policies, the vehicle is being used for a Prohibited Use, as determined by Us in Our sole discretion, or any other similar unforeseen circumstances.

DISCLAIMER OF WARRANTY AND LIMITATION OF LIABILITY

PLEASE NOTE THAT DRIVEON HOST SERVICES ARE INTENDED TO BE USED TO FACILITATE THE SHARING OF VEHICLE BY THE HOST AND TO THE GUEST. DRIVEON CANNOT AND DOES NOT CONTROL THE CONTENT IN ANY LISTINGS AND THE CONDITION, LEGALITY OR SUITABILITY OF ANY VEHICLE LISTED ON THE PLATFORM. DRIVEON IS NOT RESPONSIBLE FOR, AND DISCLAIMS ANY AND ALL LIABILITY RELATED TO, ANY AND ALL LISTINGS, BOOKINGS AND THE VEHICLE. ANY SHARING OF THE LISTED VEHICLE UNDER THE CAR SHARING AGREEMENT OR OTHERWISE WILL BE DONE ENTIRELY AT THE GUEST'S AND HOST'S OWN RISK.

THE PLATFORM IS PRESENTED "AS IS". NEITHER WE NOR OUR HOLDING, SUBSIDIARIES, AFFILIATES, PARTNERS, OR LICENSORS MAKE ANY REPRESENTATIONS OR WARRANTIES OF ANY KIND WHATSOEVER, EXPRESS OR IMPLIED, IN CONNECTION WITH THESE TERMS AND CONDITIONS OR THE PLATFORM OR ANY OF THE CONTENT, EXCEPT TO THE EXTENT SUCH REPRESENTATIONS AND WARRANTIES ARE NOT LEGALLY EXCLUDABLE.

YOU AGREE THAT, TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, NEITHER WE NOR OUR HOLDING, SUBSIDIARIES, AFFILIATES, PARTNERS, OR LICENSORS WILL BE RESPONSIBLE OR LIABLE (WHETHER IN CONTRACT, TORT (INCLUDING NEGLIGENCE) OR OTHERWISE) UNDER ANY CIRCUMSTANCES FOR ANY INTERRUPTION OF BUSINESS, ACCESS DELAYS OR ACCESS INTERRUPTIONS TO THE PLATFORM, DATA NON-DELIVERY, LOSS, THEFT, MISDELIVERY, CORRUPTION, DESTRUCTION OR OTHER MODIFICATION, LOSS OR DAMAGES OF ANY SORT INCURRED AS A RESULT OF DEALINGS WITH OR THE PRESENCE OF OFF-WEBSITE LINKS ON THE PLATFORM, VIRUSES, SYSTEM FAILURES OR MALFUNCTIONS WHICH MAY OCCUR IN CONNECTION WITH YOUR USE OF THE PLATFORM, ANY INACCURACIES OR OMISSIONS IN CONTENT, OR EVENTS BEYOND THE REASONABLE CONTROL OF DRIVEON.

FURTHER, TO THE FULLEST EXTENT PERMITTED BY LAW, NEITHER WE NOR OUR SUBSIDIARIES, AFFILIATES, PARTNERS, OR LICENSORS WILL BE LIABLE FOR ANY INDIRECT, SPECIAL, PUNITIVE, INCIDENTAL, OR CONSEQUENTIAL DAMAGES OF ANY KIND (INCLUDING LOST PROFITS) RELATED TO THE PLATFORM OR YOUR USE THEREOF REGARDLESS OF THE FORM OF ACTION WHETHER IN CONTRACT, TORT (INCLUDING NEGLIGENCE) OR OTHERWISE, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. EXCEPT FOR CLAIMS THAT ARE COVERED UNDER THE AMBIT TRIP PROTECTION PLAN OUR MAXIMUM AGGREGATE LIABILITY FOR ANY CLAIMS WHATSOEVER, SHALL NOT EXCEED INR 10,000/-

GOVERNING LAW AND JURISDICTION

These Host T&Cs shall be construed in accordance with the applicable laws of India. For proceedings arising therein the Courts at Bangalore shall have exclusive jurisdiction.

Any dispute or difference either in interpretation or otherwise, of these Host T&Cs and/or the Governing Policies, shall be referred to an independent arbitrator who will be appointed by DriveOn and his decision shall be final and binding on the parties hereto. The above arbitration shall be in accordance with the Arbitration and Conciliation Act, 1996 as amended from time to time. The seat of arbitration shall be held in Bangalore.

CORRESPONDENCE ADDRESS/ NOTICES

Unless specifically provided otherwise, any notice or demands required to be given herein shall be given to the parties hereto in writing and by either Registered Post Acknowledged Due, e-mail or by hand delivery at the addresses as mentioned below:

DriveOn India Private Limited,
1st Floor, Anjaneya Techno Park, No.147,
HAL Old Airport Road,
ISRO Colony, Kodihalli, Bangalore-560008

Email id: Host.support.in@driveon.com
Contact No: 0806-897-2200

Communication generated by DriveOn on the Users' mobile number will be deemed adequate service of notice / electronic record to the maximum extent permitted under any applicable law.

If You have any questions regarding these Host T&Cs, please email Us at Host.support.in@driveon.com`;

  return (
    <div
      className="min-h-screen w-full relative pb-20 md:pb-0"
      style={{ backgroundColor: colors.backgroundSecondary }}
    >
      {/* Header - Mobile only */}
      <div className="md:hidden">
        <ProfileHeader title="Terms & Conditions" />
      </div>

      {/* Web Header - Only visible on web */}
      <header
        className="hidden md:block w-full sticky top-0 z-50"
        style={{ backgroundColor: colors.brandBlack }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 xl:px-12">
          <div className="flex items-center h-16 md:h-20 lg:h-24 justify-between">
            {/* Left - Logo */}
            <Link to="/" className="flex-shrink-0">
              <img
                src="/driveonlogo.png"
                alt="DriveOn Logo"
                className="h-8 md:h-10 lg:h-12 xl:h-14 w-auto object-contain"
              />
            </Link>

            {/* Center - Navigation Tabs */}
            <nav className="flex items-center justify-center gap-4 md:gap-6 lg:gap-8 xl:gap-10 h-full">
              <Link
                to="/"
                className="text-xs md:text-sm lg:text-base xl:text-lg font-medium transition-all hover:opacity-80 flex items-center h-full"
                style={{ color: colors.textWhite }}
              >
                Home
              </Link>
              <Link
                to="/about"
                className="text-xs md:text-sm lg:text-base xl:text-lg font-medium transition-all hover:opacity-80 flex items-center h-full"
                style={{ color: colors.textWhite }}
              >
                About
              </Link>
              <Link
                to="/contact"
                className="text-xs md:text-sm lg:text-base xl:text-lg font-medium transition-all hover:opacity-80 flex items-center h-full"
                style={{ color: colors.textWhite }}
              >
                Contact
              </Link>
              <Link
                to="/faq"
                className="text-xs md:text-sm lg:text-base xl:text-lg font-medium transition-all hover:opacity-80 flex items-center h-full"
                style={{ color: colors.textWhite }}
              >
                FAQs
              </Link>
            </nav>

            {/* Right - Login/Signup and Profile Icon */}
            <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
              {isAuthenticated ? (
                <Link
                  to="/profile"
                  className="relative flex items-center justify-center w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14"
                >
                  {/* Circular profile icon with white border */}
                  <div className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full border-2 border-white flex items-center justify-center overflow-hidden bg-gray-800">
                    {user?.profilePhoto ? (
                      <img
                        src={user.profilePhoto}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <img
                        src={carImg1}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover"
                      />
                    )}
                  </div>
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="px-3 md:px-4 lg:px-5 xl:px-6 py-1.5 md:py-2 lg:py-2.5 rounded-lg border text-xs md:text-sm lg:text-base font-medium transition-all hover:opacity-90"
                  style={{
                    borderColor: colors.borderMedium,
                    backgroundColor: colors.backgroundSecondary,
                    color: colors.textPrimary,
                  }}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Back Button - Below Header */}
      <div className="hidden md:block w-full px-4 md:px-6 lg:px-8 xl:px-12 pt-4 md:pt-6">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            style={{ color: colors.backgroundTertiary }}
          >
            <svg
              className="w-5 h-5 md:w-6 md:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="text-base md:text-lg font-medium">Back</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="px-4 md:px-6 lg:px-8 xl:px-12 pt-6 md:pt-8 pb-6 md:pb-8 mt-4 md:mt-0">
        <div className="max-w-4xl mx-auto">
          {/* Content Container */}
          <div className="bg-white rounded-xl shadow-lg border-2 p-4 md:p-6 lg:p-8" style={{ borderColor: colors.borderLight }}>
            <div className="prose prose-sm md:prose-base lg:prose-lg max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-xs md:text-sm lg:text-base leading-relaxed" style={{ color: colors.textSecondary }}>
                {termsContent}
              </pre>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Navbar - Hidden on web */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <BottomNavbar />
      </div>
    </div>
  );
};

export default TermsAndConditionsPage;

