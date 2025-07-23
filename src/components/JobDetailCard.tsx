import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  Linking,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";

// Helper functions
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const formatDateTime = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const wordCount = (text) => (text || "").split(/\s+/).filter(Boolean).length;

// Main JobDetails component
const JobDetails = ({ job }) => {
  const [pdfVisible, setPdfVisible] = useState(false);
  const [currentPdf, setCurrentPdf] = useState("");
  if (!job)
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-gray-700">Loading job details...</Text>
      </View>
    );

  const handleLinkPress = (url) => {
    if (url.toLowerCase().endsWith(".pdf")) {
      setCurrentPdf(url);
      setPdfVisible(true);
    } else {
      Linking.openURL(url);
    }
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      className="bg-gray-100 p-4 b-4"
    >
      {/* Job Header Card */}
      <CardContainer title={""}>
        {job.image?.asset?.url && (
          <Image
            source={{ uri: job.image.asset.url }}
            className="w-full h-48 rounded-lg mb-4"
            alt={job.image.alt || "Job illustration"}
          />
        )}

        <Text className="text-2xl font-bold text-gray-900 mb-1">
          {job.title || "Untitled Job"}
        </Text>
        <Text className="text-gray-500 mb-3">
          Published on {formatDateTime(job.publishedAt)}
        </Text>

        <Text className="text-gray-700 mb-4">
          {job.description || "No description available"}
        </Text>

        <View className="bg-blue-50 rounded-lg p-3">
          <Text className="font-bold text-blue-800 text-center">
            Total Vacancies: {job.vacancyTotal || "Not specified"}
          </Text>
        </View>
      </CardContainer>

      {/* Dynamic Sections */}
      <ImportantDatesCard importantDates={job.importantDates} />
      <VacancyDetailsCard
        vacancyDetails={job.vacancyDetails}
        total={job.vacancyTotal}
      />
      <EligibilityCard eligibility={job.eligibility} />
      <PostWiseEligibilityCard postWiseEligibility={job.postWiseEligibility} />
      <ApplicationFeeCard applicationFee={job.applicationFee} />

      <ListCard title="Selection Process" items={job.selectionProcess} />

      {job?.documentsRequired && (
        <ListCard title="Required Documents" items={job.documentsRequired} />
      )}

      <ApplicationInstructionsCard instructions={job.applicationInstructions} />

      <ImportantButtonCard
        links={job.officialLinks}
        onLinkPress={handleLinkPress}
      />
      <FAQCard faqs={job.faqs} />

      <StatusBadge isActive={job.isActive} />

      {/* PDF Viewer */}
      {/* <PdfViewerModal
        visible={pdfVisible}
        url={currentPdf}
        onClose={() => setPdfVisible(false)}
      /> */}
    </ScrollView>
  );
};

export default JobDetails;

// Small components
const SectionHeader = ({ title }) => (
  <Text className="text-lg font-bold mb-3 text-blue-800">{title}</Text>
);

const InfoRow = ({ label, value, flex = false }) => (
  <View
    className={`flex-row justify-between py-2 border-b border-gray-100 ${
      flex ? "items-start" : "items-center"
    }`}
  >
    <Text className="text-gray-600 flex-shrink">{label}</Text>
    <Text className={`font-medium text-right ${flex ? "flex-1 ml-2" : ""}`}>
      {value || "N/A"}
    </Text>
  </View>
);

const CardContainer = ({ children, title }) => (
  <View className="bg-white rounded-xl p-4 shadow-md mb-4">
    {title && <SectionHeader title={title} />}
    {children}
  </View>
);

const StatusBadge = ({ isActive }) => (
  <View className="flex-row justify-end items-center mt-2 mb-6">
    <View
      className={`w-3 h-3 rounded-full mr-2 ${
        isActive ? "bg-green-500" : "bg-red-500"
      }`}
    />
    <Text className="text-gray-500">
      {isActive ? "Active Opportunity" : "Closed Opportunity"}
    </Text>
  </View>
);

const LinkButton = ({
  label,
  url,
  onPress,
}: {
  label?: string;
  url?: string;
  onPress?: (url: string) => void;
}) => (
  <TouchableOpacity
    onPress={() => {
      if (!url) {
        return Alert.alert("Error", "Link is not active right noww");
      }
      onPress(url);
    }}
    className={`bg-blue-500 rounded-lg p-3 mb-2 items-center ${
      label.includes("Notification") && "bg-red-500"
    }`}
  >
    <Text className="text-white font-medium">{label}</Text>
  </TouchableOpacity>
);

const ImportantButtonCard = ({ links, onLinkPress }) => {
  if (!links || links.length === 0) return null;

  return (
    <CardContainer title="Important Links">
      {links.map((link, index) => (
        <LinkButton
          key={index}
          label={link.label}
          url={link.url}
          onPress={onLinkPress}
        />
      ))}
    </CardContainer>
  );
};

// Main section components
const ImportantDatesCard = ({ importantDates }) => {
  if (!importantDates) return null;

  const dates = [
    { label: "Notification", value: formatDate(importantDates.notification) },
    { label: "Apply Start", value: formatDate(importantDates.applyStart) },
    { label: "Apply End", value: formatDate(importantDates.applyEnd) },
    { label: "Fee Last Date", value: formatDate(importantDates.feeLastDate) },
    { label: "Correction Window", value: importantDates.correctionWindow },
    { label: "Exam Date", value: importantDates.exam },
    { label: "Admit Card", value: importantDates.admitCard },
    { label: "Result", value: importantDates.result },
  ].filter((item) => item.value && item.value !== "N/A");

  if (dates.length === 0) return null;

  return (
    <CardContainer title="Important Dates">
      <View className="border-t border-gray-200 pt-2">
        {dates.map((date, index) => (
          <InfoRow key={index} label={date.label} value={date.value} />
        ))}
      </View>
    </CardContainer>
  );
};

const VacancyDetailsCard = ({ vacancyDetails, total }) => {
  if (!vacancyDetails || vacancyDetails.length === 0) return null;

  return (
    <CardContainer title="Vacancy Details">
      {vacancyDetails.map((vacancy, idx) => (
        <View key={idx} className="mb-4 border border-gray-200 rounded-lg p-3">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="font-semibold text-gray-800">
              {vacancy.postName || "Unnamed Post"}
            </Text>
            <Text className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
              Total: {vacancy.total || (total && 0)}
            </Text>
          </View>

          {vacancy.categoryBreakdown && (
            <View className="mt-2">
              <Text className="font-medium text-gray-700 mb-1">
                Category-wise Breakdown:
              </Text>
              <View className="flex-row flex-wrap">
                {Object.entries(vacancy.categoryBreakdown)
                  .filter(([_, value]) => typeof value === "number")
                  .map(([category, count]) => (
                    <View
                      key={category}
                      className="w-1/3 flex-row items-center py-1"
                    >
                      <Text className="text-gray-600 w-12 capitalize">
                        {category}:
                      </Text>
                      <Text className="font-medium ml-1">{count + ""}</Text>
                    </View>
                  ))}
              </View>
            </View>
          )}
        </View>
      ))}
    </CardContainer>
  );
};

const EligibilityCard = ({ eligibility }) => {
  if (!eligibility) return null;

  const renderEligibilityText = (text) => {
    if (!text) return null;

    // Split into paragraphs if over 100 words
    if (wordCount(text) > 100) {
      return text.split("\n\n").map((paragraph, idx) => (
        <Text key={idx} className="text-gray-700 mb-2">
          {paragraph}
        </Text>
      ));
    }

    return <Text className="text-gray-700">{text}</Text>;
  };

  return (
    <CardContainer title="Eligibility Criteria">
      <View className="border-t border-gray-200 pt-2">
        {eligibility.ageMin !== undefined &&
          eligibility.ageMax !== undefined && (
            <InfoRow
              label="Age Range"
              value={`${eligibility.ageMin} - ${eligibility.ageMax} years`}
            />
          )}

        {eligibility.ageAsOn && (
          <InfoRow label="Age As On" value={formatDate(eligibility.ageAsOn)} />
        )}

        {eligibility.education && (
          <View className="py-2 border-b border-gray-100">
            <Text className="text-gray-600">Education</Text>
            <View className="mt-1">
              {renderEligibilityText(eligibility.education)}
            </View>
          </View>
        )}

        {eligibility.experience && (
          <View className="py-2 border-b border-gray-100">
            <Text className="text-gray-600">Experience</Text>
            <View className="mt-1">
              {renderEligibilityText(eligibility.experience)}
            </View>
          </View>
        )}

        {eligibility.physicalStandards && (
          <View className="py-2">
            <Text className="text-gray-600">Physical Standards</Text>
            <View className="mt-1">
              {renderEligibilityText(eligibility.physicalStandards)}
            </View>
          </View>
        )}
        <Text className="text-center text-red-500 font-semibold py-1">
          For more complete information please read the offical Notification
        </Text>
      </View>
    </CardContainer>
  );
};

const PostWiseEligibilityCard = ({ postWiseEligibility }) => {
  if (!postWiseEligibility || postWiseEligibility.length === 0) return null;

  return (
    <CardContainer title="Post-wise Eligibility">
      {postWiseEligibility.map((post, index) => (
        <View
          key={index}
          className={`mb-3 p-3 border border-gray-200 rounded-lg ${
            index % 2 === 0 ? "bg-white" : "bg-gray-50"
          }`}
        >
          <Text className="font-semibold text-gray-800 text-base mb-2">
            {post.post || "Unnamed Post"}
          </Text>

          <View className="pl-2 border-l-2 border-blue-200">
            {(post.criteria || []).map((criterion, idx) => (
              <View key={idx} className="flex-row items-start mb-1.5">
                <Text className="text-blue-600 mr-1.5 text-xs mt-0.5">•</Text>
                <Text className="text-gray-700 flex-1 text-sm">
                  {criterion}
                </Text>
              </View>
            ))}
          </View>
        </View>
      ))}
    </CardContainer>
  );
};

const ApplicationFeeCard = ({ applicationFee }) => {
  if (!applicationFee || applicationFee.length === 0) return null;

  return (
    <CardContainer title="Application Fee">
      <View className="flex-row flex-wrap">
        {applicationFee.map((fee, index) => (
          <View key={index} className="w-1/2 mb-2">
            <View className="bg-gray-100 rounded p-2 mx-1">
              <Text className="text-gray-600">
                {fee.category || "Category"}
              </Text>
              <Text className="font-bold text-lg">₹{fee.amount || 0}</Text>
            </View>
          </View>
        ))}
      </View>
    </CardContainer>
  );
};

const ListCard = ({ title, items }) => {
  if (!items || items.length === 0) return null;

  return (
    <CardContainer title={title}>
      {items.map((item, index) => (
        <View key={index} className="flex-row items-start mb-2">
          <Text className="text-gray-500 mr-2">•</Text>
          <Text className="text-gray-700 flex-1">{item}</Text>
        </View>
      ))}
    </CardContainer>
  );
};

const ApplicationInstructionsCard = ({ instructions }) => {
  if (!instructions) return null;

  return (
    <CardContainer title="How to Apply">
      <Text className="text-gray-700">{instructions}</Text>
    </CardContainer>
  );
};

const ImportantLinksCard = ({ links }) => {
  if (!links || links.length === 0) return null;

  return (
    <CardContainer title="Important Links">
      {links.map((link, index) => (
        <LinkButton key={index} label={link.label} url={link.url} />
      ))}
    </CardContainer>
  );
};

const FAQCard = ({ faqs }) => {
  if (!faqs || faqs.length === 0) return null;

  return (
    <CardContainer title="FAQs">
      {faqs.map((faq, index) => (
        <View key={index} className="mb-4 border-b border-gray-100 pb-3">
          <Text className="font-semibold text-gray-800">Q: {faq.question}</Text>
          <Text className="text-gray-700 mt-1">A: {faq.answer}</Text>
        </View>
      ))}
    </CardContainer>
  );
};
