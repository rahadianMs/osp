document.addEventListener('DOMContentLoaded', () => {

    // --- GLOBAL VARIABLES ---
    let currentStep = 1;
    let emissionsChart = null; // Global variable for the chart instance

    // --- DOM ELEMENTS ---
    const startBtn = document.getElementById('start-calculation-btn');
    const calculatorSection = document.getElementById('calculator-section');
    
    // --- DATABASE OF FACTORS ---
    const dataConstants = {
        unitConversions: {
            listrik: { kWh: 1 },
            gas_alam: { 'm³': 9.8 },
            lpg: { kg: 12.8 },
            solar: { Liter: 10.0 },
            bensin: { Liter: 9.1 }
        },
        emissionFactors: { // unit: kgCO2e/kWh
            indonesia: {
                listrik: 0.713,
                gas_alam: 0.2025,
                lpg: 0.2277,
                solar: 0.2544,
                bensin: 0.2510,
            }
        },
        wasteEmissionFactors: { // unit: kgCO2e per kg limbah
            tpa: 0.58,
            incineration: 0.45,
            composting: 0.04,
            recycling: 0
        }
    };

    // --- EVENT LISTENERS ---
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            calculatorSection.classList.remove('hidden');
            calculatorSection.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // --- FUNCTIONS (Attached to window object to be accessible from HTML onclick) ---

    window.nextStep = (step) => {
        if (currentStep === 1) {
            if (!document.getElementById('occupiedRooms').value || !document.getElementById('guestRoomArea').value) {
                alert('Harap isi setidaknya "Total Kamar Terisi" dan "Luas Area Kamar".');
                return;
            }
        }
        
        document.getElementById(`step-${currentStep}`).classList.add('hidden');
        currentStep = step;
        document.getElementById(`step-${currentStep}`).classList.remove('hidden');
        updateStepIndicator(currentStep);
        window.scrollTo({ top: calculatorSection.offsetTop, behavior: 'smooth' });
    };

    window.prevStep = (step) => {
        document.getElementById(`step-${currentStep}`).classList.add('hidden');
        currentStep = step;
        document.getElementById(`step-${currentStep}`).classList.remove('hidden');
        updateStepIndicator(currentStep);
        window.scrollTo({ top: calculatorSection.offsetTop, behavior: 'smooth' });
    };
    
    window.resetCalculator = () => {
        if (emissionsChart) {
            emissionsChart.destroy();
            emissionsChart = null;
        }
        document.getElementById('calculator-form').reset();
        window.prevStep(1);
    };

    window.calculateResults = () => {
        const hotelData = getHotelData();
        if (!hotelData) return;

        const energyEmissions = calculateEnergyEmissions();
        const wasteEmissions = calculateWasteEmissions();
        
        const totalEmissionsKg = energyEmissions.total + wasteEmissions.total;
        const allocations = allocateEmissions(totalEmissionsKg, hotelData);
        
        const finalMetrics = calculateFinalMetrics(allocations, hotelData);
        
        displayResults({
            ...finalMetrics,
            hotelName: hotelData.name,
            detailEnergy: energyEmissions.total / 1000,
            detailWaste: wasteEmissions.total / 1000,
        });
        
        window.nextStep(4);
    };

    // --- HELPER FUNCTIONS ---

    function updateStepIndicator(step) {
        for (let i = 1; i <= 4; i++) {
            const indicator = document.getElementById(`step-indicator-${i}`);
            indicator.classList.remove('active', 'completed');
            if (i < step) {
                indicator.classList.add('completed');
            } else if (i === step) {
                indicator.classList.add('active');
            }
        }
    }

    function getHotelData() {
        const hotelData = {
            name: document.getElementById('hotelName').value || "Hotel Anda",
            occupiedRooms: parseFloat(document.getElementById('occupiedRooms').value) || 0,
            guestRoomArea: parseFloat(document.getElementById('guestRoomArea').value) || 0,
            meetingRoomArea: parseFloat(document.getElementById('meetingRoomArea').value) || 0,
        };
        if (hotelData.occupiedRooms === 0 || hotelData.guestRoomArea === 0) {
             alert('Harap isi "Total Kamar Terisi" dan "Luas Area Kamar" di Langkah 1.');
             window.prevStep(1);
             return null;
        }
        return hotelData;
    }

    function calculateEnergyEmissions() {
        let totalKgCO2e = 0;
        document.querySelectorAll('.energy-value').forEach(input => {
            const value = parseFloat(input.value) || 0;
            if (value > 0) {
                const type = input.dataset.energyType;
                const unit = input.nextElementSibling.textContent;
                const kWh = value * dataConstants.unitConversions[type][unit];
                const kgCO2e = kWh * dataConstants.emissionFactors.indonesia[type];
                totalKgCO2e += kgCO2e;
            }
        });
        return { total: totalKgCO2e };
    }

    function calculateWasteEmissions() {
        let totalKgCO2e = 0;
        const wasteTPA = parseFloat(document.getElementById('wasteTPA').value) || 0;
        const wasteIncineration = parseFloat(document.getElementById('wasteIncineration').value) || 0;
        const wasteComposting = parseFloat(document.getElementById('wasteComposting').value) || 0;
        
        totalKgCO2e += wasteTPA * dataConstants.wasteEmissionFactors.tpa;
        totalKgCO2e += wasteIncineration * dataConstants.wasteEmissionFactors.incineration;
        totalKgCO2e += wasteComposting * dataConstants.wasteEmissionFactors.composting;
        
        return { total: totalKgCO2e };
    }

    function allocateEmissions(totalKg, hotelData) {
        const totalArea = hotelData.guestRoomArea + hotelData.meetingRoomArea;
        const guestRoomAllocation = totalArea > 0 ? hotelData.guestRoomArea / totalArea : 1;
        
        return {
            guestRoomEmissionsKg: totalKg * guestRoomAllocation,
            meetingRoomEmissionsKg: totalKg * (1 - guestRoomAllocation)
        };
    }

    function calculateFinalMetrics(allocations, hotelData) {
        const emissionsPerRoom = hotelData.occupiedRooms > 0 ? allocations.guestRoomEmissionsKg / hotelData.occupiedRooms : 0;
        const operatingHours = 365 * 10;
        const emissionsPerMeeting = hotelData.meetingRoomArea > 0 ? allocations.meetingRoomEmissionsKg / hotelData.meetingRoomArea / operatingHours : 0;
        
        return {
            totalEmissions: (allocations.guestRoomEmissionsKg + allocations.meetingRoomEmissionsKg) / 1000,
            emissionsPerRoom: emissionsPerRoom,
            emissionsPerMeeting: emissionsPerMeeting,
        };
    }

    function displayResults(data) {
        document.getElementById('resultHotelName').textContent = `Ringkasan untuk ${data.hotelName}`;
        document.getElementById('totalEmissions').textContent = data.totalEmissions.toFixed(2);
        document.getElementById('emissionsPerRoom').textContent = data.emissionsPerRoom.toFixed(2);
        document.getElementById('emissionsPerMeeting').textContent = data.emissionsPerMeeting.toFixed(4);
        updateRecommendation(data);
        createOrUpdateChart(data);
    }
    
    function updateRecommendation(data) {
        const recommendationEl = document.getElementById('recommendationText');
        if (data.totalEmissions <= 0) {
            recommendationEl.textContent = "Tidak ada emisi terdeteksi. Silakan isi data konsumsi pada langkah sebelumnya.";
            return;
        }
        
        const energyPercentage = (data.detailEnergy / data.totalEmissions) * 100;
        if (energyPercentage > 75) {
            recommendationEl.textContent = "Mayoritas emisi Anda dari energi. Fokus pada efisiensi listrik dan energi terbarukan akan memberikan dampak terbesar.";
        } else if (energyPercentage < 25) {
            recommendationEl.textContent = "Emisi limbah Anda signifikan. Prioritaskan program pengurangan sampah, pengomposan, dan daur ulang.";
        } else {
            recommendationEl.textContent = "Emisi Anda seimbang antara energi dan limbah. Terapkan strategi efisiensi di kedua area untuk hasil optimal.";
        }
    }

    function createOrUpdateChart(data) {
        const ctx = document.getElementById('emissionsPieChart').getContext('2d');
        if (emissionsChart) {
            emissionsChart.destroy();
        }
        emissionsChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Energi', 'Limbah'],
                datasets: [{
                    label: 'Sumber Emisi (tCO₂e)',
                    data: [data.detailEnergy.toFixed(2), data.detailWaste.toFixed(2)],
                    backgroundColor: ['#059669', '#34D399'],
                    borderColor: ['#FFFFFF'],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { position: 'bottom' },
                    tooltip: {
                        callbacks: {
                            label: (context) => `${context.label}: ${context.parsed} tCO₂e`
                        }
                    }
                }
            }
        });
    }

});

