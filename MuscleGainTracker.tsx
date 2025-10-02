import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonButtons,
  IonBackButton,
  IonIcon,
  IonSelect,
  IonSelectOption
} from '@ionic/react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { calendar, analytics, barbell } from 'ionicons/icons';
import './MuscleGainTracker.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface MuscleGainRecord {
  date: string;
  measurements: {
    chest: number;
    arms: number;
    shoulders: number;
    back: number;
    legs: number;
  };
  strengthStats: {
    benchPress: number;
    deadlift: number;
    squat: number;
  };
  proteinIntake: number;
  notes: string;
}

const MuscleGainTracker: React.FC = () => {
  const [records, setRecords] = useState<MuscleGainRecord[]>([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [measurements, setMeasurements] = useState({
    chest: '',
    arms: '',
    shoulders: '',
    back: '',
    legs: ''
  });
  const [strengthStats, setStrengthStats] = useState({
    benchPress: '',
    deadlift: '',
    squat: ''
  });
  const [proteinIntake, setProteinIntake] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedChart, setSelectedChart] = useState('measurements');

  useEffect(() => {
    const stored = localStorage.getItem('muscleGainRecords');
    if (stored) {
      setRecords(JSON.parse(stored));
    }
  }, []);

  const handleUpdate = () => {
    if (!validateInputs()) {
      alert('Please fill in all required fields');
      return;
    }

    const newRecord: MuscleGainRecord = {
      date,
      measurements: {
        chest: parseFloat(measurements.chest),
        arms: parseFloat(measurements.arms),
        shoulders: parseFloat(measurements.shoulders),
        back: parseFloat(measurements.back),
        legs: parseFloat(measurements.legs)
      },
      strengthStats: {
        benchPress: parseFloat(strengthStats.benchPress),
        deadlift: parseFloat(strengthStats.deadlift),
        squat: parseFloat(strengthStats.squat)
      },
      proteinIntake: parseFloat(proteinIntake),
      notes
    };

    const updatedRecords = [...records, newRecord].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    setRecords(updatedRecords);
    localStorage.setItem('muscleGainRecords', JSON.stringify(updatedRecords));
    clearForm();
  };

  const validateInputs = () => {
    return (
      measurements.chest &&
      measurements.arms &&
      measurements.shoulders &&
      measurements.back &&
      measurements.legs &&
      strengthStats.benchPress &&
      strengthStats.deadlift &&
      strengthStats.squat &&
      proteinIntake
    );
  };

  const clearForm = () => {
    setDate(new Date().toISOString().split('T')[0]);
    setMeasurements({
      chest: '',
      arms: '',
      shoulders: '',
      back: '',
      legs: ''
    });
    setStrengthStats({
      benchPress: '',
      deadlift: '',
      squat: ''
    });
    setProteinIntake('');
    setNotes('');
  };

  const handleDeleteAll = () => {
    if (window.confirm('Are you sure you want to delete all records? This cannot be undone.')) {
      setRecords([]);
      localStorage.removeItem('muscleGainRecords');
      clearForm();
    }
  };

  const measurementsChartData = {
    labels: records.map(r => r.date),
    datasets: [
      {
        label: 'Chest (cm)',
        data: records.map(r => r.measurements.chest),
        borderColor: '#FF6B6B',
        tension: 0.1
      },
      {
        label: 'Arms (cm)',
        data: records.map(r => r.measurements.arms),
        borderColor: '#4ECDC4',
        tension: 0.1
      },
      {
        label: 'Shoulders (cm)',
        data: records.map(r => r.measurements.shoulders),
        borderColor: '#45B7D1',
        tension: 0.1
      }
    ]
  };

  const strengthChartData = {
    labels: records.map(r => r.date),
    datasets: [
      {
        label: 'Bench Press (kg)',
        data: records.map(r => r.strengthStats.benchPress),
        backgroundColor: '#FF6B6B'
      },
      {
        label: 'Deadlift (kg)',
        data: records.map(r => r.strengthStats.deadlift),
        backgroundColor: '#4ECDC4'
      },
      {
        label: 'Squat (kg)',
        data: records.map(r => r.strengthStats.squat),
        backgroundColor: '#45B7D1'
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#ffffff'
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#ffffff'
        }
      }
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#ffffff'
        }
      },
      title: {
        display: true,
        text: selectedChart === 'measurements' ? 'Body Measurements Progress' : 'Strength Progress',
        color: '#ffffff',
        font: {
          size: 16
        }
      }
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/member" />
          </IonButtons>
          <IonTitle>Muscle Gain Tracker</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div className="progress-page-bg">
          <div className="form-container">
            {/* Measurements Section */}
            <div className="form-section">
              <div className="form-section-title">
                <IonIcon icon={barbell} />
                <span>Body Measurements</span>
              </div>
              <div className="form-section-description">
                Track your body measurements in centimeters
              </div>
              <IonItem>
                <IonLabel position="stacked">Date</IonLabel>
                <IonInput 
                  type="date"
                  value={date}
                  onIonChange={e => setDate(e.detail.value!)}
                />
              </IonItem>
              {Object.entries(measurements).map(([key, value]) => (
                <IonItem key={key}>
                  <IonLabel position="stacked">{key.charAt(0).toUpperCase() + key.slice(1)} (cm)</IonLabel>
                  <IonInput
                    type="number"
                    value={value}
                    onIonChange={e => setMeasurements(prev => ({
                      ...prev,
                      [key]: e.detail.value!
                    }))}
                    placeholder={`Enter ${key} measurement`}
                  />
                </IonItem>
              ))}
            </div>

            {/* Strength Stats Section */}
            <div className="form-section">
              <div className="form-section-title">
                <IonIcon icon={analytics} />
                <span>Strength Stats</span>
              </div>
              <div className="form-section-description">
                Record your lifting achievements in kilograms
              </div>
              {Object.entries(strengthStats).map(([key, value]) => (
                <IonItem key={key}>
                  <IonLabel position="stacked">
                    {key.replace(/([A-Z])/g, ' $1').trim()} (kg)
                  </IonLabel>
                  <IonInput
                    type="number"
                    value={value}
                    onIonChange={e => setStrengthStats(prev => ({
                      ...prev,
                      [key]: e.detail.value!
                    }))}
                    placeholder={`Enter ${key.replace(/([A-Z])/g, ' $1').trim()} weight`}
                  />
                </IonItem>
              ))}
              <IonItem>
                <IonLabel position="stacked">Protein Intake (g)</IonLabel>
                <IonInput
                  type="number"
                  value={proteinIntake}
                  onIonChange={e => setProteinIntake(e.detail.value!)}
                  placeholder="Enter daily protein intake"
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Notes</IonLabel>
                <IonInput
                  value={notes}
                  onIonChange={e => setNotes(e.detail.value!)}
                  placeholder="Add any notes about your progress"
                />
              </IonItem>
            </div>
          </div>

          <div className="button-container">
            <IonButton 
              onClick={clearForm} 
              fill="outline" 
              className="ion-margin-end"
            >
              Clear Form
            </IonButton>
            <IonButton 
              onClick={handleUpdate}
              className="ion-margin-end"
            >
              Update Progress
            </IonButton>
            <IonButton 
              onClick={handleDeleteAll}
              color="danger" 
              fill="outline"
            >
              Delete All Progress
            </IonButton>
          </div>

          {records.length > 0 && (
            <div className="charts-container">
              <div className="chart-controls">
                <IonSelect
                  value={selectedChart}
                  onIonChange={e => setSelectedChart(e.detail.value)}
                  interface="popover"
                >
                  <IonSelectOption value="measurements">Measurements Progress</IonSelectOption>
                  <IonSelectOption value="strength">Strength Progress</IonSelectOption>
                </IonSelect>
              </div>
              
              <div className="chart-container">
                {selectedChart === 'measurements' ? (
                  <Line data={measurementsChartData} options={chartOptions} />
                ) : (
                  <Bar data={strengthChartData} options={chartOptions} />
                )}
              </div>
            </div>
          )}

          {records.length > 0 && (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Measurements (cm)</th>
                    <th>Strength (kg)</th>
                    <th>Protein (g)</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record, index) => (
                    <tr key={index}>
                      <td>{record.date}</td>
                      <td>
                        Chest: {record.measurements.chest}, 
                        Arms: {record.measurements.arms}, 
                        Shoulders: {record.measurements.shoulders}
                      </td>
                      <td>
                        BP: {record.strengthStats.benchPress}, 
                        DL: {record.strengthStats.deadlift}, 
                        SQ: {record.strengthStats.squat}
                      </td>
                      <td>{record.proteinIntake}</td>
                      <td>{record.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default MuscleGainTracker;